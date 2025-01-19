
const users: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string; 
  }[] = [];
  
  export const findUserByEmail = (email: string) => {
    return users.find((user) => user.email === email) || null;
  };
  
  export const insertUser = (user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    users.push(user);
  };
  
  insertUser({
    id: "1",
    firstName: "Test",
    lastName: "User",
    email: "example@app.com",
    password: "Test_111", 
  });
  
  export { users };
  