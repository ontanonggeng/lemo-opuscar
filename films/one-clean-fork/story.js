export const DUR=48;
export const ANIM_FPS=12;
export const q=t=>Math.floor(t*ANIM_FPS+1e-6)/ANIM_FPS;
export const VO={
 c01:.18,n01:2.62,c02:6.72,n02:9.64,c03:14.18,c04:17.06,n03:19.20,c05:28.18,n04:31.68,c06:42.05,n05:44.55
};
export const SHOTS=[
 [0,2.4,"disaster"],[2.4,5.7,"noraCU"],[5.7,7.9,"forkFrame"],[7.9,10.1,"twoEmergency"],
 [10.1,13.1,"load"],[13.1,14.05,"copyInsert"],[14.05,16.3,"calStop"],[16.3,18.95,"terminal"],
 [18.95,20.8,"noraReact"],[20.8,22.75,"toasterFork"],[22.75,24.55,"lampFork"],[24.55,27.5,"slipperForks"],
 [27.5,29.7,"forkling"],[29.7,31.4,"calMoved"],[31.4,34.6,"plug"],[34.6,38.5,"silence"],
 [38.5,40.8,"bowl"],[40.8,42.1,"mass"],[42.1,44.45,"calDinner"],[44.45,46.5,"noraUtensils"],[46.5,48,"button"]
];
export const shotAt=t=>SHOTS.find(s=>t>=s[0]&&t<s[1])||SHOTS.at(-1);
export const T={burst:.15,hardCut:5.7,glass:6.15,load:10.7,copy:13.35,scan:16.55,
 spawn:20.85,machineGun:24.7,forkling:27.55,plug:32.8,powerOff:33.25,drop:36.7,bowl:38.7,mass:40.85,button:46.62};
