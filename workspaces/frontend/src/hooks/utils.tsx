
export const fromHexString = (hexString: string): number =>  {
  const hexNumber = hexString.replace(/^0x/, '');
  return parseInt(hexNumber, 16);
}