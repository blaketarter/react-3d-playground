import React from "react"
import "./styles.css"
import { Link } from "react-router-dom"
import previewStars from "../../assets/star_preview.png"
import previewMountains from "../../assets/mountains_preview.png"

export function Home() {
  return (
    <div className="Home">
      <Link to="/mountains">
        <div className="Tile">
          <img alt="mountains preview" src={previewMountains} />
          <h2>Mountains</h2>
        </div>
      </Link>
      <Link to="/stars">
        <div className="Tile">
          <img alt="stars preview" src={previewStars} />
          <h2>Stars</h2>
        </div>
      </Link>
    </div>
  )
}
