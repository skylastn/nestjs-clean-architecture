import * as bcrypt from 'bcrypt';

export class EncryptExt {
  static async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10; // Marin besar marin aman tapi marin lambat
    return await bcrypt.hash(plainPassword, saltRounds);
  }
  static async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
