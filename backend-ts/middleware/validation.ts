import { NextFunction, Response, Request, RequestHandler } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    console.log("Request body in the handleValidationErrors: ", req.body);

    if(!errors.isEmpty()){
        console.log("errors: ", errors);
        return res.status(400).json({ errors: errors.array() });
    }


    next();
}

export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a non-empty string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a non-empty string"),
    body("city").isString().notEmpty().withMessage("City must be a non-empty string"),
    body("country").isString().notEmpty().withMessage("Country must be a non-empty string"),
    handleValidationErrors
] as unknown as RequestHandler;

export const validateMyRestaurantRequest = [
    body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("deliveryPrice")
      .isFloat({ min: 0 })
      .withMessage("Delivery price must be a positive number"),
    body("estimatedDeliveryTime")
      .isInt({ min: 0 })
      .withMessage("Estimated delivery time must be a postivie integar"),
    body("cuisines")
      .isArray()
      .withMessage("Cuisines must be an array")
      .not()
      .isEmpty()
      .withMessage("Cuisines array cannot be empty"),
    body("menuItems").isArray().withMessage("Menu items must be an array"),
    body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
    body("menuItems.*.price")
      .isFloat({ min: 0 })
      .withMessage("Menu item price is required and must be a postive number"),
    body("menuItems.*.description").isString().notEmpty().withMessage("Menu item's description must be a string"),
    handleValidationErrors,
  ] as unknown as RequestHandler;