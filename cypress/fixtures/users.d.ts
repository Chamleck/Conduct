declare module "./users.json" {
  export interface User {
    email: string;
    username: string;
    password: string;
  }

  export interface InvalidUser extends User {
    description: string;
  }

  const value: {
    validUser: User;
    invalidUsers: InvalidUser[];
  };

  export default value;
}
