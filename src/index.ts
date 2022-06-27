import produce, { freeze } from "immer"
import { useState, useCallback } from "react"
import { useImmer } from "use-immer"

export type Person = {
    name: string
    age: number
}

export const alice: Person = {
    name: "Alice",
    age: 20
}

export const usePerson = () => {
    const [person1, setPerson1] = useState(alice)
    const [person2, mutatePerson2] = useImmer(alice)
    const [person3, setPerson3] = useState(freeze(alice, true))

    const mutatePerson1 = useCallback((updater: (draft: Person) => void) => {
        setPerson1(person => produce(person, updater))
    }, [])

    const mutatePerson3 = useCallback((updater: (draft: Person) => void) => {
        setPerson3(person => produce(person, updater))
    }, [])

    const increaseAgePerson1Nested = useCallback(
        () => mutatePerson1(draft => produce(draft, draft2 => {
            draft2.age++
        })),
        [mutatePerson1]
    )

    const increaseAgePerson2 = useCallback(
        () => mutatePerson2(draft => {
            draft.age++
        }),
        [mutatePerson2]
    )

    const increaseAgePerson2Nested = useCallback(
        () => mutatePerson2(draft => produce(draft, draft2 => {
            draft2.age++ // BUG
        })),
        [mutatePerson2],
    )

    const increaseAgePerson3Nested = useCallback(
        () => mutatePerson3(draft => produce(draft, draft2 => {
            draft2.age++
        })),
        [mutatePerson3]
    )

    return {
        person1,
        person2,
        person3,
        mutatePerson2,
        mutatePerson3,
        increaseAgePerson1Nested,
        increaseAgePerson2Nested,
        increaseAgePerson2,
        increaseAgePerson3Nested,
    }
}
