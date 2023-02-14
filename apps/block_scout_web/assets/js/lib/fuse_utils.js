import { of } from 'rxjs'
import { delay, tap, mergeMap, repeat } from 'rxjs/operators'
import $ from 'jquery'
import 'jquery-circle-progress'

class ProgressCircle {
  constructor ($el) {
    this.$el = $el
    this.init()
  }

  init () {
    $(this.$el).circleProgress({
      value: 0,
      size: 150,
      thickness: 12,
      emptyFill: '#49687c',
      lineCap: 'round'
    }).on('circle-animation-progress', function (event, progress, stepValue) {
      $(this).find('.progress-value').html(`${Math.trunc(stepValue * 100)}%`)
    })
  }

  set (value) {
    $(this.$el).circleProgress('value', value)
  }
}

export function createCycleEndProgressCircle ($el) {
  return new ProgressCircle($el)
}

export function secondsToDhms(seconds) {
  seconds = Number(seconds)
  var floor = Math.floor

  var d = floor(seconds / (3600 * 24))
  var h = floor(seconds % (3600 * 24) / 3600)
  var m = floor(seconds % 3600 / 60)
  var s = Math.floor(seconds % 60)

  var dDisplay = d > 0 ? d + 'd ' : ''
  var hDisplay = h > 0 ? h + 'h ' : ''
  var mDisplay = m > 0 ? m + 'm ' : ''
  var sDisplay = s > 0 ? s + 's' : ''
  return dDisplay + hDisplay + mDisplay + sDisplay
}

export function poll (fn, ms, cb) {
  return of({}).pipe(
    mergeMap(_ => fn()),
    tap(cb),
    delay(ms),
    repeat()
  )
}

export function calcCycleLength (cycleStartBlock, cycleEndBlock) {
  return (cycleEndBlock - cycleStartBlock) * 3
}

export function calcCycleEndPercent (cycleEnd, cycleLength) {
  return 1 - (cycleEnd / cycleLength)
}
