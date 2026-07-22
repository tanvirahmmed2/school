# Database Schema Fault & Vulnerability Report (`schema.psql`)

This report provides a detailed analysis of structural flaws, dependency ordering bugs, data integrity risks, inconsistency loopholes, and performance bottlenecks identified within the `schema.psql` database definition of the School & Coaching Management System.

---

## 🚨 Critical Bugs & Execution Failures

### 1. Order-of-Execution Reference Failure (Circular Dependency)
PostgreSQL requires a referenced table to exist *before* a table with a Foreign Key constraint targeting it can be created. The current schema file fails to compile sequentially on a fresh database because of out-of-order foreign key declarations:

* **Teachers & Pay Scale**:
  - The `teachers` table (defined starting at **line 87**) references `teacher_pay_scale(id)` on the column `grade_id`:
    ```sql
    grade_id BIGINT REFERENCES teacher_pay_scale(id) ON DELETE SET NULL
    ```
  - However, the `teacher_pay_scale` table is not declared until **line 234**.
  - **Impact**: Running `psql -f schema.psql` on a clean database crashes immediately at line 87 with a `Relation "teacher_pay_scale" does not exist` error.

* **Staffs & Pay Scale**:
  - The `staffs` table (defined starting at **line 1263**) references `staff_pay_scale(id)` on the column `grade_id`:
    ```sql
    grade_id BIGINT REFERENCES staff_pay_scale(id) ON DELETE SET NULL
    ```
  - The `staff_pay_scale` table is not declared until **line 1748**.
  - **Impact**: Schema execution crashes at line 1263 with a `Relation "staff_pay_scale" does not exist` error.

**Solution**: Re-order the script so that `teacher_pay_scale` and `staff_pay_scale` are declared at the very top of the script (or at least before `teachers` and `staffs`), or add foreign key constraints as a separate `ALTER TABLE` step at the end of the file.

---

## 🕳️ Data Integrity & Constraint Loopholes

### 2. Status Constraint Inconsistencies (`admission_fees`)
Check constraints should restrict database values to a single, standardized set of states to prevent queries from failing due to string casing mismatches.
* In the `admission_fees` table (**line 1248**):
  ```sql
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Cancelled', 'Cancel', 'pending', 'paid', 'cancel'))
  ```
* **Fault**: This constraint allows mixed-case strings (`Pending` vs `pending`, `Paid` vs `paid`) and multiple labels for cancellation (`Cancelled` vs `Cancel` vs `cancel`). 
* **Impact**: Application logic fetching paid fees with `WHERE status = 'Paid'` will miss entries logged as `paid` or `Paid` depending on string matching, introducing reporting errors and financial data mismatch.

### 3. Typo in `student_admissions` Table
* At **lines 1226-1227**:
  ```sql
  signature TEXT,
  signature_id VARCHAR(255),
  signatre_id VARCHAR(255),
  ```
* **Fault**: There is both a `signature_id` and a `signatre_id` column. The latter is a spelling typo that is redundant and wastes storage space, or could lead to developer confusion if the typo is accidentally targeted in API queries.

### 4. Missing Check Constraints on Critical Columns
Several tables hold quantitative columns that should never store negative values or invalid ranges, but they lack database-level `CHECK` constraints:
* **Financial Amounts**:
  - `student_fee_payments.amount_paid` (line 671)
  - `expenses.amount` (line 1506)
  - `incomes.amount` (line 1545)
  - `teacher_salary_payments.amount_paid` (line 1874)
  - `staff_salary_payments.amount_paid` (line 1895)
  These columns lack a `CHECK (amount >= 0)` constraint, allowing negative transactions if the application validation layer is bypassed.
* **Enrollment Rolls**:
  - `student_enrollments.roll_number` (line 1316) does not check if the roll is positive: `CHECK (roll_number > 0)`.
* **String Enums**:
  - `student_admissions.gender` (line 1208) is a plain `VARCHAR(20)` without a `CHECK` constraint. It could accidentally store invalid strings instead of standard identifiers like `'Male'`, `'Female'`, or `'Other'`.

---

## 🔗 Lack of Database Referential Integrity (Polymorphic FKs)

### 5. Weak Foreign Key Associations
For scalability, several unified logging/audit tables employ numeric IDs without matching foreign keys (`REFERENCES` clauses) to preserve referential integrity:

* **`login_logs` user linking**:
  - **Line 1731**: `user_id BIGINT NOT NULL`
  - Because `user_role` can be `'admin'`, `'teacher'`, `'student'`, `'guardian'`, or `'staff'`, `user_id` cannot reference a single parent table.
  - **Impact**: If a teacher, student, or staff row is deleted, their corresponding `login_logs` remain in the database as orphaned rows, which can pollute security reporting.
* **`payment_transactions` references**:
  - **Line 1461**: `reference_id BIGINT`
  - This column links transactions to student invoices, salaries, or expenses polymorphic-style, but lacks constraints. If the invoice or salary row is hard-deleted, the payment ledger reference becomes invalid.
* **`stock_movements` references**:
  - **Line 1714**: `reference_id BIGINT`
  - Refers to purchases or issue records without database-level tracking.

---

## ⚡ Query Performance & Optimization Risks

### 6. Missing Indexes on High-Frequency Foreign Keys
In PostgreSQL, creating a Foreign Key constraint does **not** automatically build an index on the referencing column. Joining tables without indexing foreign keys forces a **Full Table Scan (Sequential Scan)**, which causes severe latency as the database grows.

Indexes are critically missing on the following foreign key columns:
- **`marks` table**: `exam_subject_id`, `student_enrollment_id` (joined on every report card generation).
- **`student_attendances` table**: `student_enrollment_id` (joined on daily/monthly attendance charts).
- **`student_fee_payments` table**: `student_fee_id` (scanned every time a student views their invoice ledger).
- **`hostel_allocations` table**: `room_id`, `student_id`.
- **`class_routines` table**: `class_id`, `section_id`, `subject_id`, `teacher_id` (scanned on every portal layout request).

---

## 🛠️ Schema Administration & Maintenance Issues

### 7. Trigger Redundancies and Missing Updates
* **Trigger Duplications**:
  - Trigger updates are dropped and recreated inline. While safe, there is some ordering inconsistency: `update_admissions_updated_at` trigger is declared at **line 1198**, *after* the `accepted_admissions` table is declared. Keeping the triggers grouped directly with their tables makes schema debugging easier.
* **Missing Audit logs**:
  - Tables like `result_publish` and `accepted_admissions` contain state values (e.g. `is_published`), but lack an `updated_at` timestamp or a trigger tracking when they were changed.
