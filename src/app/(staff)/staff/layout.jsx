import { SCHOOL_NAME } from '@/lib/secret';

const shortName = SCHOOL_NAME.split(" ").map((w) => w[0]).join('');

export const metadata = {
  title: `Staff | ${shortName} Campus`,
  description: `Explore Staff page at ${SCHOOL_NAME} (${shortName}).`,
};
