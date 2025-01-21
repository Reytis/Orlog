export const canSetUpGuard = (context, event) => {
    //Check if user can add player to game based on playerlist and ID
    return context.players.length < 2 && context.players.find(p => p.id === event.playerId) === undefined;
};
export const canStartGuard = (context) => {
    //Check if user can start the game
    return context.players.length === 2;
};
export const canThrowGuard = (context, event) => {
    //Check if user can throw dices based on current thrower and result
    const player = context.players.find(p => p.id === event.playerId);
    return context.curentThrower === event.playerId && player.count < 3 && player.result.length < 6;
};
export const canSelectGuard = (context, event) => {
    //Check if user can select dices to his deck based on current result 
    const player = context.players.find(p => p.id === event.playerId);
    return context.curentThrower === event.playerId && player.result.length < 6;
};
export const canSelectDiceGuard = (context, event) => {
    //Check if user can choose dices based on his turn
    return context.curentThrower === event.playerId;
};
export const canChooseGuard = (context, event) => {
    //Check if user can choose a favor based on result
    const player = context.players.find(p => p.id === event.playerId);
    return !player.isReady && player.result.length === 6;
};
export const canSelectFavorGuard = (context, event) => {
    //Check if user can select favor
    const player = context.players.find(p => p.id === event.playerId);
    return !player.isReady && player.result.length === 6 && event.playerId === player.id;
};
export const canToResoluteGuard = (context) => {
    //Check if the game is ready to the resolution phase
    return context.players.find(p => p.result.length != 6 && context.players.find(p => !p.isReady)) === undefined;
};
export const canFavorOneGuard = (context) => {
    //Check if user can use his selected favor and if the favor has the correct priority
    return context.players.find(p => p.selectedFavor !== undefined && p.selectedFavor.priority < 5) !== undefined;
};
export const canFavorTwoGuard = (context) => {
    //Check if user can use his selected favor and if the favor has the correct priority
    return context.players.find(p => p.selectedFavor !== undefined && p.selectedFavor.priority > 5) !== undefined;
};
export const canWinGuard = (context) => {
    //Check if the game is over (one player has 0 pv)
    return context.players.find(p => p.stats.pv.current <= 0) != undefined;
};
export const canNextTurnGuard = (context) => {
    //Check if the game is ready to go next turn
    return context.players.find(p => p.stats.pv.current <= 0) === undefined;
};
export const canDropGuard = (context) => {
    //Check if the player can be dropped
    return context.players.length > 0;
};
