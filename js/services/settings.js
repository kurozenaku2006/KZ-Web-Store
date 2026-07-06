export function getSetting(key){

return localStorage.getItem(key);

}

export function setSetting(
key,
value
){

localStorage.setItem(
key,
value
);

}

export function getStoreSettings(){

return{

storeName:
getSetting("storeName"),

currency:
getSetting("currency"),

lowStock:
getSetting("lowStock"),

tax:
getSetting("tax"),

shipping:
getSetting("shipping"),

rewardRate:
getSetting("rewardRate"),

maintenance:
getSetting("maintenance")

};

}