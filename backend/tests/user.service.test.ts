import { mockRepository } from "../__mocks__/typeorm";
import { getOne, getMany } from "../src/services/user.service";

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should return a user by id", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    mockRepository.findOne.mockResolvedValue(mockUser);

    const result = await getOne(1);

    expect(result).toEqual(mockUser);
    expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it("should return a many users", async () => {
    const mockUsers = [{ id: 1, email: "test@example.com" }];
    mockRepository.find.mockResolvedValue(mockUsers);

    const result = await getMany();

    expect(result).toEqual(mockUsers);
    expect(mockRepository.find).toHaveBeenCalledTimes(1);
  });
});
