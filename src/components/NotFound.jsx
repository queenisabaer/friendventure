import { Link } from "react-router-dom"
import PageNotFound from "../assets/404.webp"
import Asset from "./Asset"

const NotFound = () => {
  return (
    <div className="text-center">
        <Link  to={'/'}> 
        <Asset src={PageNotFound}/>
        Boo! Looks like you’re lost! Come back to the homepage.</Link>
    </div>
  )
}

export default NotFound