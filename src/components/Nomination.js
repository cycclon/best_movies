import Winner from './Winner'

const Nomination = ({ nomination }) => {
  return (
    <div className="nomination">
      <h3>{nomination.category}{nomination.winner ? <Winner /> : <small className='light-italic'>(nominee)</small>}</h3>
      <ul>
        {
          nomination.reason.map((r)=>{
            return <li key={r}>{r}</li>
          })
        }
      </ul>
    </div>
  )
}

export default Nomination
