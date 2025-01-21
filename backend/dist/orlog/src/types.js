/*
  GAME DATAS
*/
export var Face;
(function (Face) {
    Face["axe"] = "axe";
    Face["helmet"] = "helmet";
    Face["shield"] = "shield";
    Face["bow"] = "bow";
    Face["hand"] = "hand";
})(Face || (Face = {}));
export var Gods;
(function (Gods) {
    Gods["thrymr"] = "thrymr";
    Gods["var"] = "var";
    Gods["loki"] = "loki";
    Gods["freyja"] = "freyja";
    Gods["frigg"] = "frigg";
    Gods["tyr"] = "tyr";
    Gods["skuld"] = "skuld";
    Gods["freyr"] = "freyr";
    Gods["skadi"] = "skadi";
    Gods["mimir"] = "mimir";
    Gods["bragi"] = "bragi";
    Gods["vidar"] = "vidar";
    Gods["brunhild"] = "brunhild";
    Gods["baldr"] = "baldr";
    Gods["ullr"] = "ullr";
    Gods["heimdall"] = "heimdall";
    Gods["hel"] = "hel";
    Gods["thor"] = "thor";
    Gods["odin"] = "odin";
    Gods["idunn"] = "idunn";
    Gods["none"] = "undefined"; //none
})(Gods || (Gods = {}));
export var Character;
(function (Character) {
    Character["eivorHomme"] = "eivor-homme";
    Character["eivorFemme"] = "eivor-femme";
})(Character || (Character = {}));
export var GameStates;
(function (GameStates) {
    GameStates["LOBBY"] = "LOBBY";
    GameStates["TURN"] = "TURN";
    GameStates["RESOLUTION"] = "RESOLUTION";
    GameStates["VICTORY"] = "VICTORY";
})(GameStates || (GameStates = {}));
export var subStates;
(function (subStates) {
    subStates["throw"] = "throw";
    subStates["chooseDice"] = "chooseDice";
    subStates["chooseFavor"] = "chooseFavor";
    subStates["resolution"] = "resolution";
    subStates["pointRes"] = "pointRes";
    subStates["favorOneRes"] = "favorOneRes";
    subStates["resultRes"] = "resultRes";
    subStates["favorTwoRes"] = "favorTwoRes";
    subStates["endResolution"] = "endResolution";
})(subStates || (subStates = {}));
