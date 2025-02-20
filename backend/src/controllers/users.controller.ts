import { Request, Response } from "express";
import { Router } from "express";
import * as Userservice from "../services/user.service";
import { UserDto } from "../dtos/user.dto";
import * as DataTransformer from "../utils/data-transformer";

const getMany = async (req: Request, res: Response): Promise<any> => {
  // note: should consider pagination and record limiters
  const users = await Userservice.getMany();
  const transformedUsers = users.map((user) =>
    DataTransformer.transformToDto(UserDto, user)
  );
  return res.json(transformedUsers);
};

const getOne = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const user = await Userservice.getOne(+id);

  // note: need to move this to the service, using NotFoundException
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(DataTransformer.transformToDto(UserDto, user));
};

const router = Router();

/**
 * @swagger
 * /users:
 *  get:
 *     summary: List of users
 *     responses:
 *       200:
 *         description: Get one user
 *         content:
 *           application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              example: 1
 *                          name:
 *                              type: string
 *                              description: user fullname
 *                          email:
 *                              type: string
 *                              example: test@mail.com
 *                          createdAt:
 *                              type: datetime
 *                              example: 2025-02-20T05:42:08.908Z
 *                              description: when the record is created
 *                          updateAt:
 *                              type: datetime
 *                              example: 2025-02-20T05:42:08.908Z
 *                              description: when the record last updated
 */
router.get("/", getMany);

/**
 * @swagger
 * /users/:id:
 *  get:
 *     summary: Get one user
 *     responses:
 *       200:
 *         description: Get one user
 *         content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: integer
 *                          example: 1
 *                      name:
 *                          type: string
 *                          description: user fullname
 *                      email:
 *                          type: string
 *                          example: test@mail.com
 *                      createdAt:
 *                          type: datetime
 *                          example: 2025-02-20T05:42:08.908Z
 *                          description: when the record is created
 *                      updateAt:
 *                          type: datetime
 *                          example: 2025-02-20T05:42:08.908Z
 *                          description: when the record last updated
 */
router.get("/:id", getOne);

export default router;
