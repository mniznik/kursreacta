import React from 'react'
import classNames from 'classnames'

import Clock from './Clock'
import uuid from 'uuid'

function TimeboxEditor (props) {
  const {
    isEditable,
    totalTime,
    onSetTotalTime,
    onConfirm
  } = props
  return (
    <div className={`TimeboxEditor ${isEditable ? '' : 'inactive'}`}>
      <label>Co robisz ?<input disabled={!isEditable} type="text" disabled
                               value="Uczę się skrótów klawiszowych"/></label><br/>
      <label>Ile czasu ?<input disabled={!isEditable} type="text" value={totalTime}
                               onChange={onSetTotalTime}/></label><br/>
      <button onClick={onConfirm} disabled={!isEditable}>Zatwierdź zmiany</button>
    </div>
  )
}

function ProgressBar ({percent = 33, trackRemaining = false, className, big = false, color = null}) {
  const float = trackRemaining ? 'right' : 'left'
  const progressClassNames = classNames(
    "progress",
    className,
    {
      "progress--big": big,
      "progress--color-red": color === "red"
    }
  )
  return (
    <div className={progressClassNames}>
      <div className="progress__bar" style={{width: `${percent}%`, float}}></div>
    </div>
  )
}

class CurrentTimeBox extends React.Component {

  state = {
    isRunning: false,
    isPaused: false,
    pausesCount: 0,
    elapsedTimeInSeconds: 0,
  }

  handlesStart = (event) => {
    this.setState({
      isRunning: true
    })
    this.startTimer()
  }

  handlesStop = (event) => {
    this.setState({
      isRunning: false,
      isPaused: false,
      pausesCount: 0,
      elapsedTimeInSeconds: 0
    })
    this.stopTimer()
  }

  startTimer () {
    this.intervalId = window.setInterval(
      () => {
        this.setState(
          prevState => ({
            elapsedTimeInSeconds: prevState.elapsedTimeInSeconds + 0.1
          })
        )
      },
      100
    )
  }

  stopTimer () {
    window.clearInterval(this.intervalId)
  }

  togglePause = () => {
    this.setState(
      prevState => {
        const isPaused = !prevState.isPaused
        if (isPaused) {
          this.stopTimer()
        } else {
          this.startTimer()
        }
        return {
          isPaused,
          pausesCount: isPaused ? prevState.pausesCount + 1 : prevState.pausesCount
        }
      }
    )
  }

  render () {
    const {isPaused, isRunning, pausesCount, elapsedTimeInSeconds} = this.state
    const {totalTime, isEditable, onEdit} = this.props
    const timeLeftInSeconds = totalTime - elapsedTimeInSeconds
    const hoursLeft = Math.floor(timeLeftInSeconds / 3600)
    const minutesLeft = Math.floor(timeLeftInSeconds % 3600 / 60)
    const secondsLeft = Math.floor(timeLeftInSeconds % 3600 % 60)
    const progressInPercent = (elapsedTimeInSeconds / totalTime) * 100.0
    if (progressInPercent > 100) {
      this.stopTimer()
    }
    return (
      <div className={`CurrentTimeBox ${isEditable ? 'inactive' : ''}`}>
        <h1>Uczę się skrótów klawiszowych</h1>
        <Clock hours={hoursLeft} minutes={minutesLeft} seconds={secondsLeft} className={isPaused ? 'inactive' : ''}/>
        <ProgressBar className={isPaused ? 'inactive' : ''} percent={progressInPercent} trackRemaining={false} big={true} color="red"/>
        <button onClick={onEdit} disabled={isEditable}>Edytuj</button>
        <button onClick={this.handlesStart} disabled={isRunning}>Start</button>
        <button onClick={this.handlesStop} disabled={!isRunning}>Stop</button>
        <button onClick={this.togglePause} disabled={!isRunning}>{isPaused ? 'Wznów' : 'Pauzuj'}</button>
        Liczba przerw: {pausesCount}
      </div>
    )
  }
}

class EditableTimer extends React.Component {
  state = {
    totalTime: '00:01:00',
    totalTimeInSeconds: 60,
    isEditable: true
  }

  handleSetTotalTime = (event) => {
    const convertStringToSeconds = (hmsms) => {
      const a = hmsms.split(':')
      const validHours = a[0] > 23 ? 23 : a[0]
      const validMinutes = a[1] > 59 ? 59 : a[1]
      const validSeconds = a[2] > 59 ? 59 : a[2]
      return (+validHours) * 60 * 60 + (+validMinutes) * 60 + (+validSeconds)
    }
    const seconds = event.target.value ? convertStringToSeconds(event.target.value) : 0
    this.setState({
      totalTimeInSeconds: seconds,
      totalTime: event.target.value
    })
  }

  handleConfirm = () => {
    this.setState({isEditable: false})
  }

  handleEdit = () => {
    this.setState({isEditable: true})
  }

  render () {
    const {totalTime, totalTimeInSeconds, isEditable} = this.state
    return (
      <>
        <TimeboxEditor
          isEditable={isEditable}
          totalTime={totalTime}
          onSetTotalTime={this.handleSetTotalTime}
          onConfirm={this.handleConfirm}
        />
        <CurrentTimeBox
          isEditable={isEditable}
          totalTime={totalTimeInSeconds}
          onEdit={this.handleEdit}
        />
      </>
    )
  }
}

class TimeboxCreator extends React.Component {
  constructor (props) {
    super(props)
    this.titleInput = React.createRef()
    this.totalTimeInSecondsInput = React.createRef()
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onCreate({
      id: uuid.v4(),
      title: this.titleInput.current.value,
      totalTimeInSeconds: this.totalTimeInSecondsInput.current.value
    })
    this.titleInput.current.value = ''
    this.totalTimeInSecondsInput.current.value = ''
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit} className="TimeboxCreator">
        <label>
          Co robisz ?
          <input
            ref={this.titleInput}
          />
        </label><br/>
        <label>
          Ile czasu ?
          <input
            ref={this.totalTimeInSecondsInput}
          />
        </label><br/>
        <button>Dodaj timebox</button>
      </form>
    )
  }
}

class Timebox extends React.Component {
  state = {
    title: this.props.title,
    totalTimeInSeconds: this.props.totalTimeInSeconds,
    isEditable: false
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onEditConfirm(this.props.index, {
      title: this.state.title,
      totalTimeInSeconds: this.state.totalTimeInSeconds
    })
    this.setState({
      isEditable: false
    })
  }

  handleTitleChange = (event) => {
    this.setState({
      title: event.target.value
    })
  }

  handleTotalTimeInSecondsChange = (event) => {
    this.setState({
      totalTimeInSeconds: event.target.value
    })
  }

  handleEdit = () => {
    this.setState({
      isEditable: true
    })
  }

  render () {
    const {title, totalTimeInSeconds, isEditable} = this.state
    return isEditable
      ? (
        <form className="TimeboxForm" onSubmit={this.handleSubmit}>
          <label>Co robisz ?
            <input
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
          </label><br/>
          <label>Ile ?
            <input
              onChange={this.handleTotalTimeInSecondsChange}
              value={this.state.totalTimeInSeconds}
            />
          </label><br/>
          <button>Zatwierdź zmiany</button>
        </form>
      )
      : (
        <div className="Timebox">
          <h3>{this.props.title} - {this.props.totalTimeInSeconds}</h3>
          <button onClick={this.props.onDelete}>Usuń</button>
          <button onClick={this.handleEdit}>Zmień</button>
        </div>
      )
  }
}

class TimeboxList extends React.Component {
  state = {
    timeboxes: [
      {
        id: '1',
        title: 'Uczę się list',
        totalTimeInSeconds: 25
      },
      {
        id: '2',
        title: 'Uczę się formularzy',
        totalTimeInSeconds: 15
      },
      {
        id: '3',
        title: 'Uczę się komponentów niekontrolowanych',
        totalTimeInSeconds: 50
      }
    ]
  }

  addTimebox = (timebox) => {
    this.setState(prevState => {
      const timeboxes = [...prevState.timeboxes, timebox]
      return {timeboxes}
    })
  }

  removeTimebox = (indexToRemove) => {
    this.setState(prevState => {
      const timeboxes = prevState.timeboxes.filter((timebox, index) => index !== indexToRemove)
      return {timeboxes}
    })
  }

  updateTimebox = (indexToUpdate, updateTimebox) => {
    this.setState(prevState => {
      const timeboxes = prevState.timeboxes.map((timebox, index) =>
        index === indexToUpdate ? updateTimebox : timebox
      )
      return {timeboxes}
    })
  }

  handleCreate = (createdTimebox) => {
    this.addTimebox(createdTimebox)
  }

  handleConfirmEditTimebox = (indexToUpdate, newTimebox) => {
    this.setState(prevState => {
      const timeboxes = prevState.timeboxes.map((timebox, index) =>
        index === indexToUpdate ? {...timebox, ...newTimebox} : timebox
      )
      return {timeboxes}
    })
  }

  render () {
    return (
      <>
        <TimeboxCreator onCreate={this.handleCreate}/>
        {this.state.timeboxes.map((timebox, index) => (
          <Timebox
            key={timebox.id}
            index={index}
            title={timebox.title}
            totalTimeInSeconds={timebox.totalTimeInSeconds}
            onDelete={() => this.removeTimebox(index)}
            onEditConfirm={this.handleConfirmEditTimebox}
          />
        ))}
      </>
    )
  }
}

export { EditableTimer, TimeboxList}
