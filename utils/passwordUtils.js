import bcrypt from 'bcrypt';

export const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}


export const comparePassword = async (inputPassword, hashedPassword)=> {
    return await bcrypt.compare(inputPassword, hashedPassword);
}