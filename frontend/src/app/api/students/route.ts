import { Student } from '@/src/app/types/student';
import { faker } from '@faker-js/faker';
import { NextResponse } from 'next/server';

const createRandomUser = (): Student => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const location = faker.location;
  return {
    firstName,
    lastName,
    id: faker.string.nanoid(7),
    city: location.city(),
    state: location.state(),
    number: faker.phone.number({ style: 'international' }),
    email: faker.internet.email({ firstName, lastName }),
  };
};

export async function GET() {
  const users = faker.helpers.multiple(createRandomUser, {
    count: 1000,
  });

  return NextResponse.json({ users });
}
