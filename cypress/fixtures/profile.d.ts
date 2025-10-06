declare module "./profile.json" {
  export interface ProfileFixture {
    email: string;
    username: string;
    bio: string;
    password: string;
  }

  const value: {
    validProfile: ProfileFixture;
  };

  export default value;
}