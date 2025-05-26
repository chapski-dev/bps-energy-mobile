export const validator = {
  email(val: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // email_incorrect
    return regex.test(val);
  },
  password(val: string) {
    // const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@?\-*=+!./#$&])[a-zA-Z0-9@?\-*=+!./#$&]{6,}$/;
    // password_does_not_meet_requirements
    // return regex.test(val);
    return true;
  }
}