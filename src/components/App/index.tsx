import React from "react"
import { Home } from "../Home"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import { CremaMountains } from "../CremaMountains"
import { CremaStar } from "../CremaStar"
import "normalize.css"
import "./styles.css"

export function App() {
  return (
    <div className="App">
      <Router>
        <div className="Navbar">
          <Route path="/:any">
            <Link to="/">← Back</Link>
          </Route>
          <Switch>
            <Route path="/mountains">
              <h1 className="Title">Mountains</h1>
            </Route>
            <Route path="/stars">
              <h1 className="Title">Stars</h1>
            </Route>
            <Route>
              <h1 className="Title">react-three-fiber</h1>
            </Route>
          </Switch>
        </div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/mountains">
            <CremaMountains />
          </Route>

          <Route path="/stars">
            <CremaStar />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}
