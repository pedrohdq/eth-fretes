export const addressFactory = "0x70d4b76389E1445065Cab445c50a164C2195abDf";

export const Errors = {
    "NotConnected": "Not connected to the wallet. In order to access this page, you need to connect to your Metamask!"
}

export const Success = {
    "FreightAdded": "Your freight had been added successfully!",
    "SetWinningOffer": "Winning offer had been set!"
}

export const FreightSituation = {
    0: "Auction",
    1: "Waiting the transporter to confirm",
    2: "Waiting the transporter to pick up the load",
    3: "On carriage",
    4: "Stopped",
    5: "Delivered",
    6: "Delivered late",
    7: "Not delivered",
    8: "Returned load to the company"
}

export const convertUnixDate = (unix) => {
    const dateObject = new Date(unix * 1000);
    return dateObject.toLocaleString();
}