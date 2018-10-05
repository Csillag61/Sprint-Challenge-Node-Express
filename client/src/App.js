import React, { Component } from 'react';
import axios from "axios";
import "./App.css";
import { Jumbotron } from "reactstrap";
import { Route, Link } from "react-router-dom";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      actions: []
    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/projects/').then(result => {
      console.log(result);
      this.setState({ projects: result.data });
    });

    axios.get('http://localhost:5000/api/actions/').then(result => {
      this.setState({ actions: result.data });
    });


  }
  render() {
    return (
      <div className="App">
        <Route exact path="/" render={() => {
          return (
            <Link to="/projects">
              <Jumbotron>
                <h1 className="project">View Projects</h1>
              </Jumbotron>
            </Link>
          )
        }} />
        <Route exact path="/projects" render={() => {
          console.log(this.state.projects);
          return this.state.projects.map((project, index) => {
            return (
              <Link key={index} to={`/projects/${project.id}`}>
                <Jumbotron>
                  <h1 className="project">{project.name}</h1>
                </Jumbotron>
              </Link>
            );
          });
        }} />
        <Route path="/projects/:id" render={props => {
          let project = this.state.projects.filter(project => Number(props.match.params.id) === project.id)[0];
          if (project) return (
            <div>
              <h1>{project.name + "s actions"}</h1>
              {
                this.state.actions
                  .filter(action => Number(props.match.params.id) === action.project_id)
                  .map((action, index) => {
                    return (
                      <Jumbotron key={index}>
                        <h1 className="action">{action.description}</h1>
                      </Jumbotron>
                    );
                  })
              }
              <Link to="/projects"><h1>Back</h1></Link>
            </div>
          );
          else return <div />;
        }} />
      </div>
    );
  }
}
export default App;
