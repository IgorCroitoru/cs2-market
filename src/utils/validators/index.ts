import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsArrayOfAssetIds(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isArrayOfAssetIds',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Check if the value is an array
          if (!Array.isArray(value)) {
            return false;
          }

          // Check if all items are either strings or numbers of the specified length
          return value.every(item => {
            if (typeof item === 'string' || typeof item === 'number') {
              const itemString = String(item);
              // Check if string length is correct and consists only of digits
              return itemString.length >= 6 && itemString.length <= 12 && /^\d+$/.test(itemString);
            }
            return false;
          });
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of strings or numbers with exactly ${length} digits, and strings must contain only numeric characters`;
        },
      },
    });
  };
}
