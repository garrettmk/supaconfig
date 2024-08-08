'use client';

import clsx from "clsx";
import { useRef, forwardRef } from "react";
import { useDateSegment, useLocale, useTimeField } from "react-aria";
import { mergeRefs } from "react-merge-refs";
import { DateSegment, TimeFieldState, TimeFieldStateOptions, useTimeFieldState } from "react-stately";

export type TimeInputProps = Omit<TimeFieldStateOptions, 'locale'> & {
  className?: string
}

export const TimeInput = forwardRef<HTMLDivElement, TimeInputProps>(function TimeInput(props, forwardedRef) {
  const { className, ...timeFieldOptions } = props;
  const { locale } = useLocale();
  const state = useTimeFieldState({ ...timeFieldOptions, locale });

  const localRef = useRef<HTMLDivElement>(null);
  const ref = mergeRefs([forwardedRef, localRef]);
  const { labelProps, fieldProps } = useTimeField({ ...timeFieldOptions, label: timeFieldOptions.label ?? 'time' }, state, localRef);

  return (
    <div className="flex" {...fieldProps} ref={ref}>
      {state.segments.map((segment, i) => (
        <DateSegment 
          key={i} 
          state={state}
          segment={segment} 
          isDisabled={state.isDisabled}
        />
      ))}
    </div>
  );
});

export type DateSegmentProps = {
  segment: DateSegment
  state: TimeFieldState
  isDisabled?: boolean
}

export function DateSegment({ segment, state, isDisabled }: DateSegmentProps) {
  const ref = useRef(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div 
      ref={ref}
      className={clsx("px-[4px]", {
        'opacity-50': isDisabled,
      })} 
      {...segmentProps} 
    >
      {segment.text}
    </div>
  );
}