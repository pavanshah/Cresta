var ChatComponent = React.createClass({
	
	getInitialState: function(){
		return {
			messages : [],
			socket : window.io('http://localhost:3000')
		}
	},

	componentDidMount : function(){
		
		this.state.socket.subscribe(room);
		room++;

		this.state.socket.emit("new_message", "yo yo yo");

		this.state.socket.on("receive_message", function(message){
			console.log("Received message "+message);
		});

	},

	render : function(){
		return (
			<div>Chat application</div>
		);
	}
});

ReactDOM.render(
	<ChatComponent/>,
	document.getElementById("chat")
);
