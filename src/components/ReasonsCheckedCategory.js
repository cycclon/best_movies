import { useRef } from 'react'
import Reason from './Reason'

const ReasonsCheckedCategory = ({ categoryID, reasons, addReason, removeReason }) => {
  
  const reason = useRef()

  function handleRemoveReason(e, removedReason){
    e.preventDefault()
    removeReason(removedReason)
  }

  const handleClick = (e)=>{
    e.preventDefault()
    addReason(reason.current.value)
    reason.current.value = ''
  }

  return (
    <div style={{marginTop: "5px"}}>
      <label>Reason: </label>
      <input id={'nr'+categoryID} type="text" ref={reason}
      onKeyDown={(e)=>{
        if(e.key === 'Enter') {
          handleClick(e)
        }
      }} />
      <button onClick={(e)=> { handleClick(e) }} className='btn-add-reason'>Add</button>
      <div>
        {reasons.length > 0 ? reasons.map((reason)=><Reason key={reason} reason={reason} handleRemoveReason={handleRemoveReason} />) : ''}
      </div>
    </div>
  ) 
}

export default ReasonsCheckedCategory
