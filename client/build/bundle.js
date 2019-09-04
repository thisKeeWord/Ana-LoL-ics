(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/Users/lkee/Google Drive/Projects/ana-lol-ics/client/components/about.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouter = require("react-router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var About =
/*#__PURE__*/
function (_React$Component) {
  _inherits(About, _React$Component);

  function About() {
    _classCallCheck(this, About);

    return _possibleConstructorReturn(this, _getPrototypeOf(About).apply(this, arguments));
  }

  _createClass(About, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement("div", {
        id: "aboutMe"
      }, _react["default"].createElement("div", {
        id: "backHome"
      }, _react["default"].createElement("ul", {
        className: "linkToPages"
      }, _react["default"].createElement("li", {
        className: "goHome"
      }, _react["default"].createElement(_reactRouter.Link, {
        to: "/"
      }, "Home")))), _react["default"].createElement("div", {
        id: "championBackground",
        style: {
          backgroundImage: "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kennen_4.jpg)"
        }
      }), _react["default"].createElement("div", {
        id: "description"
      }, _react["default"].createElement("p", null, "Ana-LoL-ics doesn't just give a more specialized way of viewing stats by game - played on Summoner's Rift - it allows side-by-side analysis of games."), _react["default"].createElement("p", null, "Users can view stats - warding, creep score, deaths, etc - side-by-side, which should give a better and a more straightfoward idea of betterment."), _react["default"].createElement("p", null, "*The site is still undergoing changes. Thank you for your patience.*"), _react["default"].createElement("p", null, "*For the optimal view, please use a desktop browser to use the site in as full a window as possible.*"), _react["default"].createElement("div", {
        className: "icons"
      }, _react["default"].createElement("a", {
        href: "https://www.linkedin.com/in/thiskeeword"
      }, _react["default"].createElement("i", {
        className: "fa fa-linkedin fa-lg li grow",
        id: "iconLink",
        target: "_blank"
      })), _react["default"].createElement("a", {
        href: "https://www.github.com/thisKeeWord"
      }, _react["default"].createElement("i", {
        className: "fa fa-github-alt fa-lg gh grow",
        id: "iconLink",
        target: "_blank"
      })))));
    }
  }]);

  return About;
}(_react["default"].Component);

exports["default"] = About;

},{"react":"/Users/lkee/Google Drive/Projects/ana-lol-ics/node_modules/react/index.js","react-router":"/Users/lkee/Google Drive/Projects/ana-lol-ics/node_modules/react-router/index.js"}],"/Users/lkee/Google Drive/Projects/ana-lol-ics/client/components/app.js":[function(require,module,exports){
"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactRouterDom = require("react-router-dom");

var _headApp = _interopRequireDefault(require("./headApp.js"));

var _about = _interopRequireDefault(require("./about.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_reactRouterDom.BrowserRouter, null, _react["default"].createElement(_reactRouterDom.Route, {
        path: "/",
        component: _headApp["default"]
      }), _react["default"].createElement(_reactRouterDom.Route, {
        path: "/about",
        component: _about["default"]
      }), _react["default"].createElement(_reactRouterDom.Route, {
        path: "/userName/:username",
        component: _about["default"]
      }));
    }
  }]);

  return App;
}(_react["default"].Component);

_reactDom["default"].render(_react["default"].createElement(App, null), document.getElementById("content"));

},{"./about.js":"/Users/lkee/Google Drive/Projects/ana-lol-ics/client/components/about.js","./headApp.js":"/Users/lkee/Google Drive/Projects/ana-lol-ics/client/components/headApp.js","react":"/Users/lkee/Google Drive/Projects/ana-lol-ics/node_modules/react/index.js","react-dom":"/Users/lkee/Google Drive/Projects/ana-lol-ics/node_modules/react-dom/index.js","react-router-dom":"/Users/lkee/Google Drive/Projects/ana-lol-ics/node_modules/react-router-dom/index.js"}],"/Users/lkee/Google Drive/Projects/ana-lol-ics/client/components/champBuild.js":[function(require,module,exports){
"use strict";

var _react = _interopRequireDefault(require("react"));

var _jquery = _interopRequireDefault(require("jquery"));

var d3 = _interopRequireWildcard(require("d3"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ChampBuild =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ChampBuild, _React$Component);

  function ChampBuild() {
    _classCallCheck(this, ChampBuild);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChampBuild).apply(this, arguments));
  }

  _createClass(ChampBuild, [{
    key: "itemization",
    // GET PLAYER'S ITEM BUILD
    value: function itemization() {
      var _this = this;

      if (this.props.timeline1 && this.props.gamesToSee === 1 || this.props.timeline2 && this.props.gamesToSee === 2) {
        var itemsPerGame = [];

        var _loop = function _loop(i) {
          var searchEvents = _this.props["timeline" + i.toString()];

          var itemStorage = _this.props["itemStorage" + i.toString()];

          var eachPlayersItems = []; // 10 ARRAYS, 1 PER PLAYER

          _this.props["playerInfo" + i.toString()].forEach(function (player) {
            var itemStore = [];
            var findTrinket = false;
            var potions, biscuits, controlWards;
            var consumables = []; // AT CURRENT SPOT IN TIMELINE

            if (searchEvents[_this.props.spot]) {
              // health potion is 2003
              for (var j = 0; j <= _this.props.spot; j++) {
                if (searchEvents[j][0].events) {
                  potions = 0, biscuits = 0, controlWards = 0;

                  for (var k = 0; k < searchEvents[j][0].events.length; k++) {
                    var findItem = searchEvents[j][0].events[k].itemId; // ITEM_PURCHASED

                    if (searchEvents[j][0].events[k].type === "ITEM_PURCHASED" && searchEvents[j][0].events[k].participantId === player[0]) {
                      itemStore.push(findItem);
                    } // ITEM_DESTROYED


                    if (searchEvents[j][0].events[k].type === "ITEM_DESTROYED" && searchEvents[j][0].events[k].participantId === player[0]) {
                      if (itemStore.lastIndexOf(findItem) !== -1) {
                        itemStore.splice(itemStore.lastIndexOf(findItem), 1);
                      }
                    } // ITEM_SOLD


                    if (searchEvents[j][0].events[k].type === "ITEM_SOLD" && searchEvents[j][0].events[k].participantId === player[0]) {
                      if (itemStore.lastIndexOf(findItem) !== -1) {
                        itemStore.splice(itemStore.lastIndexOf(findItem), 1);
                      }
                    } // ITEM_UNDO, PLAYER MAY HAVE "DESTROYED" RECIPE ITEMS TO GET NEW ONE


                    if (searchEvents[j][0].events[k].type === "ITEM_UNDO" && searchEvents[j][0].events[k].participantId === player[0]) {
                      if (searchEvents[j][0].events[k].afterId === 0) {
                        var checkItemEvent = searchEvents[j][0].events[k].beforeId; // IF PLAYER PURCHASES POTION AND UNDO'S THE PURCHASE
                        // if (checkItemEvent === 2003) {
                        //   potions--;
                        // }
                        // if (checkItemEvent === 2010) {
                        //   biscuits--;
                        // }
                        // if (checkItemEvent === 2055) {
                        //   controlWards--;
                        // }

                        itemStore.splice(itemStore.lastIndexOf(searchEvents[j][0].events[k].beforeId), 1);
                        var retrieveItem = k;

                        while (searchEvents[j][0].events[retrieveItem] && searchEvents[j][0].events[retrieveItem].type !== "ITEM_PURCHASED" && findItem !== checkItemEvent) {
                          if (itemStorage[checkItemEvent].from) {
                            if (searchEvents[j][0].events[retrieveItem].type === "ITEM_DESTROYED" && itemStorage[checkItemEvent].from.includes(searchEvents[j][0].events[retrieveItem].itemId.toString())) {
                              itemStore.push(searchEvents[j][0].events[retrieveItem].itemId);
                            }
                          }

                          retrieveItem--;
                        }
                      }
                    } // DUPLICATE TRINKET


                    if ((findItem === 3340 || findItem === 3341 || findItem === 3363 || findItem === 3364) && itemStore.indexOf(findItem) !== -1 && itemStore.lastIndexOf(findItem) !== itemStore.indexOf(findItem)) {
                      itemStore.splice(itemStore.lastIndexOf(findItem), 1);
                    } // if ((itemStore.includes(2003) && findItem === 2003) && searchEvents[j][0].events[k].participantId === player[0])  {
                    //   potions++;
                    // }
                    // if ((itemStore.includes(2010) && findItem === 2010) && searchEvents[j][0].events[k].participantId === player[0])  {
                    //   biscuits++;
                    // }
                    // if ((itemStore.includes(2055) && findItem === 2055) && searchEvents[j][0].events[k].participantId === player[0])  {
                    //   controlWards++;
                    // }

                  } // NO TRINKET


                  if (player[0] <= 5 && findTrinket === false && searchEvents[j][0].participantFrames[player[0]].position) {
                    if (Math.sqrt(Math.pow(searchEvents[j][0].participantFrames[player[0]].position.x - 703, 2) + Math.pow(searchEvents[j][0].participantFrames[player[0]].position.y - 703, 2)) > 4184) {
                      if (!itemStore.includes(3340) && !itemStore.includes(3341) && !itemStore.includes(3363) && !itemStore.includes(3364)) {
                        itemStore.push(3340);
                        findTrinket = true;
                      }
                    }
                  }

                  if (player[0] > 5 && findTrinket === false && searchEvents[j][0].participantFrames[player[0]].position) {
                    if (Math.sqrt(Math.pow(searchEvents[j][0].participantFrames[player[0]].position.x - 14130, 2) + Math.pow(searchEvents[j][0].participantFrames[player[0]].position.y - 14130, 2)) > 4204) {
                      if (!itemStore.includes(3340) && !itemStore.includes(3341) && !itemStore.includes(3363) && !itemStore.includes(3364)) {
                        itemStore.push(3340);
                        findTrinket = true;
                      }
                    }
                  }
                }

                if (itemStore.includes(2003)) {
                  for (var countPotions = itemStore.lastIndexOf(2003); countPotions >= itemStore.indexOf(2003); countPotions--) {
                    if (itemStore[countPotions] === 2003) {
                      potions++;

                      if (countPotions !== itemStore.indexOf(2003)) {
                        delete itemStore[countPotions];
                      }
                    }
                  }
                }

                if (itemStore.includes(2010)) {
                  for (var countBiscuits = itemStore.lastIndexOf(2010); countBiscuits >= itemStore.indexOf(2010); countBiscuits--) {
                    if (itemStore[countBiscuits] === 2010) {
                      biscuits++;

                      if (countBiscuits !== itemStore.indexOf(2010)) {
                        delete itemStore[countBiscuits];
                      }
                    }
                  }
                }

                if (itemStore.includes(2055)) {
                  for (var countControlWards = itemStore.lastIndexOf(2055); countControlWards >= itemStore.indexOf(2055); countControlWards--) {
                    if (itemStore[countControlWards] === 2055) {
                      controlWards++;

                      if (countControlWards !== itemStore.indexOf(2055)) {
                        delete itemStore[countControlWards];
                      }
                    }
                  }
                }
              }

              itemStore = itemStore.filter(function (element) {
                return element !== undefined;
              });
              consumables.push({
                2003: potions,
                2010: biscuits,
                2055: controlWards
              });
            } // IF SCROLL EXCEEDS GAME LENGTH


            if (!searchEvents[_this.props.spot]) {
              for (var z = 0; z < searchEvents.length; z++) {
                potions = 0, biscuits = 0, controlWards = 0;

                if (searchEvents[z][0].events) {
                  for (var w = 0; w < searchEvents[z][0].events.length; w++) {
                    var _findItem = searchEvents[z][0].events[w].itemId; // ITEM_PURCHASED

                    if (searchEvents[z][0].events[w].type === "ITEM_PURCHASED" && searchEvents[z][0].events[w].participantId === player[0]) {
                      itemStore.push(_findItem); // if ((itemStore.includes(2003) && findItem === 2003) && searchEvents[j][0].events[w].participantId === player[0])  {
                      //   potions++;
                      // }
                      // if ((itemStore.includes(2010) && findItem === 2010) && searchEvents[j][0].events[w].participantId === player[0])  {
                      //   biscuits++;
                      // }
                      // if ((itemStore.includes(2055) && findItem === 2055) && searchEvents[j][0].events[w].participantId === player[0])  {
                      //   controlWards++;
                      // }
                    } // ITEM_DESTROYED


                    if (searchEvents[z][0].events[w].type === "ITEM_DESTROYED" && searchEvents[z][0].events[w].participantId === player[0]) {
                      if (itemStore.lastIndexOf(_findItem) !== -1) {
                        itemStore.splice(itemStore.lastIndexOf(_findItem), 1);
                      }
                    } // ITEM_SOLD


                    if (searchEvents[z][0].events[w].type === "ITEM_SOLD" && searchEvents[z][0].events[w].participantId === player[0]) {
                      if (itemStore.lastIndexOf(_findItem) !== -1) {
                        itemStore.splice(itemStore.lastIndexOf(_findItem), 1);
                      }
                    } // ITEM_UNDO, PLAYER MAY HAVE "DESTROYED" RECIPE ITEMS TO GET NEW ONE


                    if (searchEvents[z][0].events[w].type === "ITEM_UNDO" && searchEvents[z][0].events[w].participantId === player[0]) {
                      if (searchEvents[z][0].events[w].afterId === 0) {
                        var _checkItemEvent = searchEvents[z][0].events[w].beforeId; // potions and control wards
                        // if (checkItemEvent === 2003) {
                        //   potions--;
                        // }
                        // if (checkItemEvent === 2010) {
                        //   biscuits--;
                        // }
                        // if (checkItemEvent === 2055) {
                        //   controlWards--;
                        // }

                        itemStore.splice(itemStore.lastIndexOf(searchEvents[z][0].events[w].beforeId), 1);
                        var _retrieveItem = w;

                        while (searchEvents[z][0].events[_retrieveItem] && searchEvents[z][0].events[_retrieveItem].type !== "ITEM_PURCHASED" && _findItem !== _checkItemEvent) {
                          if (itemStorage[_checkItemEvent].from) {
                            if (searchEvents[z][0].events[_retrieveItem].type === "ITEM_DESTROYED" && itemStorage[_checkItemEvent].from.includes(searchEvents[z][0].events[_retrieveItem].itemId.toString())) {
                              itemStore.push(searchEvents[z][0].events[_retrieveItem].itemId);
                            }
                          }

                          _retrieveItem--;
                        }
                      }
                    } // DUPLICATE TRINKET


                    if ((_findItem === 3340 || _findItem === 3341 || _findItem === 3363 || _findItem === 3364) && itemStore.indexOf(_findItem) !== -1 && itemStore.lastIndexOf(_findItem) !== itemStore.indexOf(_findItem)) {
                      itemStore.splice(itemStore.lastIndexOf(_findItem), 1);
                    } // if ((itemStore.includes(2003) && findItem === 2003) && searchEvents[j][0].events[w].participantId === player[0])  {
                    //   potions++;
                    // }
                    // if ((itemStore.includes(2010) && findItem === 2010) && searchEvents[j][0].events[w].participantId === player[0])  {
                    //   biscuits++;
                    // }
                    // if ((itemStore.includes(2055) && findItem === 2055) && searchEvents[j][0].events[w].participantId === player[0])  {
                    //   controlWards++;
                    // }

                  } // NO TRINKET


                  if (player[0] <= 5 && findTrinket === false && searchEvents[z][0].participantFrames[player[0]].position) {
                    if (Math.sqrt(Math.pow(searchEvents[z][0].participantFrames[player[0]].position.x - 703, 2) + Math.pow(searchEvents[z][0].participantFrames[player[0]].position.y - 703, 2)) > 4184) {
                      if (!itemStore.includes(3340) && !itemStore.includes(3341) && !itemStore.includes(3363) && !itemStore.includes(3364)) {
                        itemStore.push(3340);
                        findTrinket = true;
                      }
                    }
                  }

                  if (player[0] > 5 && findTrinket === false && searchEvents[z][0].participantFrames[player[0]].position) {
                    if (Math.sqrt(Math.pow(searchEvents[z][0].participantFrames[player[0]].position.x - 14130, 2) + Math.pow(searchEvents[z][0].participantFrames[player[0]].position.y - 14130, 2)) > 4204) {
                      if (!itemStore.includes(3340) && !itemStore.includes(3341) && !itemStore.includes(3363) && !itemStore.includes(3364)) {
                        itemStore.push(3340);
                        findTrinket = true;
                      }
                    }
                  }
                }

                if (itemStore.includes(2003)) {
                  for (var _countPotions = itemStore.lastIndexOf(2003); _countPotions >= itemStore.indexOf(2003); _countPotions--) {
                    if (itemStore[_countPotions] === 2003) {
                      potions++;

                      if (_countPotions !== itemStore.indexOf(2003)) {
                        delete itemStore[_countPotions];
                      }
                    }
                  }
                }

                if (itemStore.includes(2010)) {
                  for (var _countBiscuits = itemStore.lastIndexOf(2010); _countBiscuits >= itemStore.indexOf(2010); _countBiscuits--) {
                    if (itemStore[_countBiscuits] === 2010) {
                      biscuits++;

                      if (_countBiscuits !== itemStore.indexOf(2010)) {
                        delete itemStore[_countBiscuits];
                      }
                    }
                  }
                }

                if (itemStore.includes(2055)) {
                  for (var _countControlWards = itemStore.lastIndexOf(2055); _countControlWards >= itemStore.indexOf(2055); _countControlWards--) {
                    if (itemStore[_countControlWards] === 2055) {
                      controlWards++;

                      if (_countControlWards !== itemStore.indexOf(2055)) {
                        delete itemStore[_countControlWards];
                      }
                    }
                  }
                }
              }

              itemStore = itemStore.filter(function (element) {
                return element !== undefined;
              });
              consumables.push({
                2003: potions,
                2010: biscuits,
                2055: controlWards
              });
            }

            eachPlayersItems.push([itemStore, consumables]);
          });

          itemsPerGame.push(eachPlayersItems);
        };

        for (var i = 1; i <= this.props.gamesToSee; i++) {
          _loop(i);
        }

        return itemsPerGame;
      }
    }
  }, {
    key: "appendItems",
    value: function appendItems(showItems) {
      var _this2 = this;

      // REMOVE CONSTANT CREATIONS OF ICONS AND BUILD IMAGES
      if (this.props.addItems1 && this.props.gamesToSee === 1 || this.props.addItems2 && this.props.gamesToSee === 2) {
        var _loop2 = function _loop2(i) {
          var colorOfTeam = "blue";

          if (document.getElementById("allItems" + i * _this2.props.gamesToSee)) {
            (0, _jquery["default"])(".champBuilds" + i * _this2.props.gamesToSee).remove();
            (0, _jquery["default"])(".champIcons" + i * _this2.props.gamesToSee).remove();
            (0, _jquery["default"])("allItems" + i * _this2.props.gamesToSee).remove();
            (0, _jquery["default"])(".consumeableBackground" + i * _this2.props.gamesToSee).remove();
          }

          if (document.getElementById("laneRole" + i * _this2.props.gamesToSee)) {
            (0, _jquery["default"])("laneRole" + i * _this2.props.gamesToSee).remove();
          }

          if (document.getElementsByClassName("consumableCount" + i * _this2.props.gamesToSee)) {
            (0, _jquery["default"])(".consumableCount" + i * _this2.props.gamesToSee).remove();
          } // EACH PLAYER'S BUILDS


          var _loop3 = function _loop3(w) {
            if (w > 4) {
              colorOfTeam = "purple";
            } // WID=WIDTH HARDCODED FOR NOW


            var wid = 466;

            var build = _this2.props["playerInfo" + i.toString()][w]; // FLIP SECOND BUILD FOR SYMMETRY


            if (i === 2) {
              d3.select("#whichTeamBuild" + colorOfTeam + w + "0").remove();

              _this2.props["addItems" + i.toString()].append("svg:g").attr("class", "champIcons" + i * _this2.props.gamesToSee).selectAll("image").data([[]]).enter().append("svg:image").attr("xlink:href", "http://ddragon.leagueoflegends.com/cdn/" + _this2.props["patch" + i.toString()] + "/img/champion/" + _this2.props["champName" + i.toString()][build[1]] + ".png").attr("y", w * 45).attr("x", 264).style({
                width: "40px",
                height: "40px",
                marginBottom: "3px"
              });

              _this2.props["addItems" + i.toString()].append("svg:g").attr("id", "whichTeamBuild" + colorOfTeam + w + "0").selectAll("rect").data([[]]).enter().append("rect").attr("y", w * 45).attr("x", 264).style({
                "stroke-width": 2,
                stroke: colorOfTeam.toString()
              }).attr("height", 39).attr("width", 39).attr("fill", "transparent"); // item images


              _this2.props["addItems" + i.toString()].append("svg:g").attr("class", "champBuilds" + i * _this2.props.gamesToSee).selectAll("image").data(showItems[i - 1][w][0]).enter().append("svg:image").attr("xlink:href", function (d) {
                if (d) {
                  return "http://ddragon.leagueoflegends.com/cdn/" + _this2.props["patch" + i.toString()] + "/img/item/" + d + ".png";
                }
              }).attr("x", function (d, i) {
                return 232 - 30 * i;
              }).attr("y", 45 * w + 10).style({
                width: "30px",
                height: "30px"
              }); // add rectangle frame for consumable count background


              _this2.props["addItems" + i.toString()].append("svg:g").attr("class", "consumeableBackground" + i * _this2.props.gamesToSee).selectAll("rect").data(showItems[i - 1][w][0]).enter().append("rect").attr("x", function (d, el) {
                if (showItems[i - 1][w][1][0][d] > 0) {
                  return 229 - 30 * el;
                }
              }).attr("y", function (d, el) {
                if (showItems[i - 1][w][1][0][d] > 0) {
                  return 45 * w + 10;
                }
              }).style({
                "stroke-width": 1,
                stroke: "black"
              }).attr("height", function (d, el) {
                return showItems[i - 1][w][1][0][d] > 0 ? 17 : 0;
              }).attr("width", function (d, el) {
                return showItems[i - 1][w][1][0][d] > 0 ? 17 : 0;
              }).attr("fill", function (d, el) {
                return showItems[i - 1][w][1][0][d] > 0 ? "grey" : "white";
              }); // consumable counts


              _this2.props["addItems" + i.toString()].append("svg:g").attr("class", "consumableCount" + i * _this2.props.gamesToSee).selectAll("text").data(showItems[i - 1][w][0]).enter().append("text").text(function (d) {
                if (showItems[i - 1][w][1][0][d] > 0) {
                  return showItems[i - 1][w][1][0][d];
                }
              }).attr("x", function (d, i) {
                return 233 - 30 * i;
              }).attr("y", 45 * w + 24).style({
                "font-size": "15px"
              }); // player role on team


              _this2.props["whichRole" + i.toString()].append("svg:g").attr("class", "champRoles" + i * _this2.props.gamesToSee).selectAll("text").data([_this2.props["playerInfo" + i.toString()][w][2], _this2.props["playerInfo" + i.toString()][w][3]]).enter().append("text").text(function (d, i) {
                if (d === "DUO_SUPPORT") {
                  return "support";
                }

                if (d === "DUO_CARRY") {
                  return "adcarry";
                }

                if (d === "NONE") {
                  return;
                }

                return d.toLowerCase();
              }).attr("x", function (d, i) {
                return 1;
              }).attr("y", function (d, i) {
                return 45 * w + ((i + 1) * 10 + 10);
              }).attr("font-size", "10px").attr("text-anchor", "start").style({
                width: "20px",
                height: "20px"
              }).attr("fill", "#cccccc");
            } else {
              d3.select("#whichTeamBuild" + colorOfTeam + w).remove();

              _this2.props["addItems" + i.toString()].append("svg:g").attr("class", "champIcons" + i * _this2.props.gamesToSee).selectAll("image").data([[]]).enter().append("svg:image").attr("xlink:href", "http://ddragon.leagueoflegends.com/cdn/" + _this2.props["patch" + i.toString()] + "/img/champion/" + _this2.props["champName" + i.toString()][build[1]] + ".png").attr("y", w * 45).style({
                width: "40px",
                height: "40px",
                marginBottom: "3px",
                "float": "right"
              });

              _this2.props["addItems" + i.toString()].append("svg:g").attr("id", "whichTeamBuild" + colorOfTeam + w).selectAll("rect").data([[]]).enter().append("rect").attr("y", w * 45).style({
                "stroke-width": 2,
                stroke: colorOfTeam.toString()
              }).attr("height", 39).attr("width", 39).attr("fill", "transparent"); // item images


              _this2.props["addItems" + i.toString()].append("svg:g").attr("class", "champBuilds" + i * _this2.props.gamesToSee).selectAll("image").data(showItems[i - 1][w][0]).enter().append("svg:image").attr("xlink:href", function (d) {
                if (d) {
                  return "http://ddragon.leagueoflegends.com/cdn/" + _this2.props["patch" + i.toString()] + "/img/item/" + d + ".png";
                }
              }).attr("x", function (d, i) {
                return 30 * i + 40;
              }).attr("y", 45 * w + 10).style({
                width: "30px",
                height: "30px"
              }); // add rectangle frame for consumable count background


              _this2.props["addItems" + i.toString()].append("svg:g").attr("class", "consumeableBackground" + i * _this2.props.gamesToSee).selectAll("rect").data(showItems[i - 1][w][0]).enter().append("rect").attr("x", function (d, el) {
                if (showItems[i - 1][w][1][0][d] > 0) {
                  return 30 * el + 53;
                }
              }).attr("y", function (d, el) {
                if (showItems[i - 1][w][1][0][d] > 0) {
                  return 45 * w + 10;
                }
              }).style({
                "stroke-width": 1,
                stroke: "black"
              }).attr("height", function (d, el) {
                return showItems[i - 1][w][1][0][d] > 0 ? 17 : 0;
              }).attr("width", function (d, el) {
                return showItems[i - 1][w][1][0][d] > 0 ? 17 : 0;
              }).attr("fill", function (d, el) {
                return showItems[i - 1][w][1][0][d] > 0 ? "grey" : "white";
              }); // append consumables


              _this2.props["addItems" + i.toString()].append("svg:g").attr("class", "consumableCount" + i * _this2.props.gamesToSee).selectAll("text").data(showItems[i - 1][w][0]).enter().append("text").text(function (d) {
                if (showItems[i - 1][w][1][0][d] > 0) {
                  return showItems[i - 1][w][1][0][d];
                }
              }).attr("x", function (d, i) {
                return 30 * i + 57;
              }).attr("y", 45 * w + 24).style({
                "font-size": "15px"
              }); // player role on team


              _this2.props["whichRole" + i.toString()].append("svg:g").attr("id", "champRoles" + i * _this2.props.gamesToSee).selectAll("text").data([_this2.props["playerInfo" + i.toString()][w][2], _this2.props["playerInfo" + i.toString()][w][3]]).enter().append("text").text(function (d, i) {
                if (d === "DUO_SUPPORT") {
                  return "support";
                }

                if (d === "DUO_CARRY") {
                  return "adcarry";
                }

                if (d === "NONE") {
                  return;
                }

                return d.toLowerCase();
              }).attr("x", function (d, i) {
                return 49;
              }).attr("y", function (d, i) {
                return 45 * w + ((i + 1) * 10 + 10);
              }).attr("font-size", "10px").attr("text-anchor", "end").style({
                width: "20px",
                height: "20px"
              }).attr("fill", "#cccccc");
            }
          };

          for (var w = 0; w < _this2.props["playerInfo" + i.toString()].length; w++) {
            _loop3(w);
          }
        };

        for (var i = 1; i <= this.props.gamesToSee; i++) {
          _loop2(i);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var showItems = this.itemization();

      if (!showItems && this.props.gamesToSee === 1) {
        return _react["default"].createElement("div", {
          id: "builds"
        });
      }

      var items = this.appendItems(showItems); // ARRAY MAY HAVE NUMBER, SO FIND IT AND GET CHAMP IMG
      // GAME 1

      if (this.props.gamesToSee === 1) {
        return _react["default"].createElement("div", null, _react["default"].createElement("div", {
          id: "builds" + 1 * this.props.gamesToSee
        }, items), _react["default"].createElement("div", {
          id: "roleLane" + 1 * this.props.gamesToSee
        }));
      } // GAME 2


      if (this.props.gamesToSee === 2) {
        var arr = [1, 2];
        return _react["default"].createElement("div", null, arr.map(function (i) {
          return _react["default"].createElement("div", null, _react["default"].createElement("div", {
            id: "builds" + i * _this3.props.gamesToSee,
            key: i
          }, items), _react["default"].createElement("div", {
            id: "roleLane" + i * _this3.props.gamesToSee,
            key: i + i
          }));
        }));
      }
    }
  }]);

  return ChampBuild;
}(_react["default"].Component);

module.exports = ChampBuild;

},{"d3":"/Users/lkee/Google Drive/Projects/ana-lol-ics/node_modules/d3/d3.js","jquery":"/Users/lkee/Google Drive/Projects/ana-lol-ics/node_modules/jquery/dist/jquery.js","react":"/Users/lkee/Google Drive/Projects/ana-lol-ics/node_modules/react/index.js"}]