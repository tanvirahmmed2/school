import { SCHOOL_NAME } from '@/lib/secret';

const shortName = SCHOOL_NAME.split(" ").map((w) => w[0]).join('');

export const metadata = {
  title: `Teacher | ${shortName} Campus`,
  description: `Explore Teacher page at ${SCHOOL_NAME} (${shortName}).`,
};
