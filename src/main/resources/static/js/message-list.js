class MessageList {
    constructor() {
        this.list = [];
        this.counter = 0;
    }

    add(message) {
        this.list[this.counter] = message;
        this.counter++;
    }

    filterByChannel(channelName) {
        var messageList = [];
        var msgListCounter = 0;
        for(let i = 0; i < this.counter; i++) {
            if(this.list[i].channel === channelName) {
                messageList[msgListCounter] = this.list[i];
                msgListCounter++;
            }
        }
        return messageList;
    }

    getAllMessages() {
        return this.list;
    }
}