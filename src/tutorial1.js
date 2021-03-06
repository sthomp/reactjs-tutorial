/** @jsx React.DOM */

var converter = new Showdown.converter();

var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}}/>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = _.map(this.props.data, function(comment){
      return <Comment author={comment.author}>{comment.text}</Comment>
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(){
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if(!text || !author){
      return false;
    }
    else{
      // TODO: send request to server
      this.props.onCommentSubmit({author: author, text: text});
      this.refs.author.getDOMNode().value = '';
      this.refs.text.getDOMNode().value = '';
      return false;
    }
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author"/>
        <input type="text" placeholder="Say something..." ref="text"/>
        <input type="submit" value="Post" />
      </form>
    );
  }
});


var CommentBox = React.createClass({
  loadCommentsFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data){
        this.setState({
          isLoading: false,
          data: data
        });
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment){
    var comments = this.state.data;
    var newComments = [comment].concat(comments);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.loadCommentsFromServer();
      }.bind(this),
      error: function(xhr, status, err){
        console.log("POST Fail");
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      isLoading: true,
      data: []
    };
  },
  componentWillMount: function(){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {

    if(this.state.isLoading){
      var inner = <p>Loading!</p>;
    }
    else{
      var inner = (
        <div>
          <h1>Comments</h1>
          <CommentList data={this.state.data}/>
          <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        </div>
      );
    }
    
    return (
        <div className="commentBox">
          {inner}
        </div>
    );
  }
});



React.renderComponent(
  <CommentBox url="http://localhost:9001/mydata" pollInterval={2000}/>,
  document.getElementById('content')
);