import PasswordValidator from "password-validator";

export const doubleDigit = (val: string | number) =>
  Number(val) >= 10 ? Number(val) : "0" + Number(val);

export const roundMinutes = (hrs = 2) => {
  const date = new Date();
  date.setHours(date.getHours() + hrs);
  date.setMinutes(0, 0, 0);
  return date;
};

var tester =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

type numStr = number | string;

export const padding = (a: numStr, b?: numStr, c?: numStr, d?: numStr) => ({
  paddingTop: a,
  paddingRight: b ?? a,
  paddingBottom: c ?? a,
  paddingLeft: d ?? b ?? a,
});

export const EmailValidator = {
  validate(email: string) {
    if (!email) return false;

    var emailParts = email.split("@");

    if (emailParts.length !== 2) return false;

    var account = emailParts[0];
    var address = emailParts[1];

    if (account.length > 64) return false;
    else if (address.length > 255) return false;

    var domainParts = address.split(".");
    if (
      domainParts.some(function (part) {
        return part.length > 63;
      })
    )
      return false;

    if (!tester.test(email)) return false;

    return true;
  },
};

export const validatePassword = (password: string) => {
  var PassValidator = new PasswordValidator();
  PassValidator.is()
    .min(8)
    .is()
    .max(40)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(1)
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]);

  return PassValidator.validate(password);
};
