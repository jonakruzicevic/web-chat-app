import React, { Component } from 'react';
import Messages from './components/Massages';
import Input from './components/Input';

function randomName() {
  const firstName = [
   'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'James', 'Amelia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Harper',
   'Danuta', 'Alehandro', 'Eliot', 'Amelie', 'Isabel', 'Lucas', 'Mia', 'Henry', 'Alexander', 'Robert'
  ];
  const lastName = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Milles', 'Davis', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young'
  ];
  const fName = firstName[Math.floor(Math.random() * firstName.length)];
  const lName = lastName[Math.floor(Math.random() * lastName.length)];
  return fName + lName;
}

function memberColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}


class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: memberColor(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("5ZmmbcmoY0sJpsYB", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <>
       <div className="App">
        <div className="App-header">
          <h1>Chat</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
      </>
     
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;