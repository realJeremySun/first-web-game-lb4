const IPAddress = "http://[::1]:3000/";
export const apiService = {
  character: IPAddress + "characters",
  changename: IPAddress + "characters/name",
  login: IPAddress + "characters/login",
  updatecharacter: IPAddress + "updatecharacter",
  initCharacter: IPAddress + "updatecharacter/initCharacter",
  updateweapon: IPAddress + "updatecharacter/weapon",
  updatearmor: IPAddress + "updatecharacter/armor",
  updateskill: IPAddress + "updatecharacter/skill"
};
