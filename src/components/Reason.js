import { PlayIcon } from '@heroicons/react/24/solid'

const Reason = ({ reason, handleRemoveReason }) => {
  
  return (
    <div className="reason-wrapper">
      <PlayIcon className='reason-icon' viewBox='0 0 30 30' style={{verticalAlign: "top"}} />
      <label className="reason">{reason}</label>
      <button className="remove-btn" onClick={(e)=>handleRemoveReason(e, reason)}>X</button>
    </div>
  )
}

export default Reason
