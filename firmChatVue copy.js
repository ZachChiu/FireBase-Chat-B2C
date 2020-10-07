const firebaseConfig = {
  apiKey: "AIzaSyDuqtBWimHhPICLUmgXaauyADjji_0dB7A",
  authDomain: "chat-32256.firebaseapp.com",
  databaseURL: "https://chat-32256.firebaseio.com",
  projectId: "chat-32256",
  storageBucket: "chat-32256.appspot.com",
  messagingSenderId: "408366532798",
  appId: "1:408366532798:web:9414d64342b80fe20276ef",
  measurementId: "G-HX852L8C0B",
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// var msgRef = firebase.database().ref("/chat/");
// console.log(msgRef);

new Vue({
  el: "#app",
  data: {
    company: "A11",
    user: "B01",
    chatRoomNum: "",
    messageRoomNum: "",
    msglist: {},
    chatlist: [],
    textMessage: "",
    firmList: [
      {
        name: "子庭寵物寄宿",
        id: "A01",
        img:
          "https://stickershop.line-scdn.net/stickershop/v1/product/7909/LINEStorePC/main.png;compress=true",
      },
      {
        name: "阿龐狗狗寄宿",
        id: "A03",
        img: "https://imgs.gvm.com.tw/upload/gallery/20190611/66663_01.jpg",
      },
      {
        name: "欣穎喵喵屋",
        id: "A11",
        img:
          "https://ichef.bbci.co.uk/news/410/cpsprodpb/2616/production/_112705790_2fyvl0k80001000.png",
      },
      {
        name: "天陸老人堂",
        id: "A88",
        img:
          "https://img.ltn.com.tw/Upload/partner/page/2019/09/11/190911-4824-01-bIL1w.jpg",
      },
      {
        name: "品蓉豬圈",
        id: "A99",
        img:
          "https://pgw.udn.com.tw/gw/photo.php?u=https://uc.udn.com.tw/photo/2019/08/23/99/6727973.jpg&x=0&y=0&sw=0&sh=0&sl=W&fw=1200",
      },
    ],
    userList: [
      {
        name: "邱廷鈺",
        id: "B01",
        img: "https://upload.cc/i1/2020/08/20/xsiJw3.png",
      },
      {
        name: "吳文凱",
        id: "B27",
        img: "https://upload.cc/i1/2020/08/20/kqBfI2.png",
      },
      {
        name: "林家妤",
        id: "B65",
        img: "https://upload.cc/i1/2020/08/20/8soOgr.png",
      },
    ],
  },
  created() {
    this.showList();
  },
  filter: {
    timeformat: function (val) {
      var value = new Date(val).toLocaleTimeString;
      return value
    },
    test: function (val) {
      return '$' + val
    }
  },
  methods: {
    showList: function () {
      let vm = this;
      this.chatlist = [];
      firebase.database().ref('chat').once("value").then(function (snapshot) {
        const getlist = snapshot.val();
        const keys = Object.keys(getlist);
        let len = 0
        keys.forEach((element) => {
          if (element.indexOf(vm.company) != -1) {
            vm.chatlist.push(getlist[element])
            vm.chatlist[len].room = element
            len += 1
          }
        })
        // console.log(JSON.stringify(Object.keys(vm.chatlist))); //丟給子庭
        // const len = Object.keys(vm.chatlist).map((key) => ({ id: key, ...vm.chatlist[key] }))
        // console.log(len);
        vm.chatlist.forEach((e, i) => {
          if (e.room.indexOf(vm.userList[i].id) != -1) {
            e.name = vm.userList[i].name;
            e.img = vm.userList[i].img;
          }
        })
        vm.chatlist = vm.chatlist.sort(function (a, b) {
          return b.updatetime - a.updatetime
        })
        vm.user = vm.chatlist[0].userId
        vm.showChat();
      });
    },
    choose: function (item) {
      firebase.database().ref(this.chatRoomNum).off();
      firebase.database().ref(this.messageRoomNum).off();
      const stringSplit = item.room.split('-')
      this.user = stringSplit[1];
      this.showChat();
    },
    showChat: function () {
      let vm = this;
      this.chatRoomNum = `/chat/${this.company}-${this.user}`;
      this.messageRoomNum = `/message/${this.company}-${this.user}`;
      const msgRef = firebase.database().ref(this.messageRoomNum);
      msgRef.on("value", function (snapshot) {
        const val = snapshot.val();
        vm.msglist = val
          ? Object.keys(val).map((key) => ({ id: key, ...val[key] }))
          : null;
        vm.msglist.forEach(element => {
          element.time = new Date(element.time).toLocaleTimeString()
        });
        console.log(vm.msglist);
      });
    },
    addMessage: function () {
      let vm = this;
      if (this.textMessage == "") {
        alert("請輸入文字");
      } else {
        const chatRef = firebase.database().ref(this.chatRoomNum);
        const msgRef = firebase.database().ref(this.messageRoomNum);
        const time = new Date().getTime();
        chatRef.set({
          lastMsg: vm.textMessage,
          updatetime: time,
          userId: vm.user,
          firmId: vm.company,
          userRead: false,
          firmRead: true,
        });
        msgRef.push({
          user: vm.company,
          message: vm.textMessage,
          time: time,
        });
        this.textMessage = "";
      }
      this.showList()
    },
  },
});
