import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password is too long'),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name is too long'),
  }),
});


export const updateUserSchema = z.object({
    body: z.object({
      email: z.string().email('Invalid email format').optional(),
      password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long')
        .optional(),
      name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name is too long')
        .optional(),
    }).refine((data) => {
      // Ensure at least one field is provided for update
      return Object.keys(data).length > 0;
    }, {
      message: "At least one field must be provided for update"
    }),
  });
  
  export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
  export type CreateUserInput = z.infer<typeof createUserSchema>['body']; 