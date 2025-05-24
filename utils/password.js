import bcrypt from 'bcrypt';


export async function saltAndHashPassword(password) {

    return await bcrypt.hash(password, 10);
}