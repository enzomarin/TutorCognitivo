import { useEffect, useState } from "react";
import type { Hint } from "../types";


export const useHint = (hints: Hint[],answerId: number ) =>{

  //const numberOfHints = hints.length
  const [indUnlockedHint, setIndUnlockedHint] = useState(0)
  //const [displayHints, setDisplayHints] = useState<Hint[]>(hints)
  const [unlockedHints, setUnlockedHints] = useState<Hint[]>([]);

  const [currentHint, setCurrentHint] = useState(0)
  const [totalHints, setTotalHints] = useState(hints.length)
  const [disabledPrevButton, setDisabledPrevButton] = useState(true)
  const [disabledNextButton, setDisabledNextButton] = useState(false)
  const [numHintsActivated, setNumHintsActivated] = useState(0); // Nuevo estado para el número de hints activados



  const genericHints = hints.filter((hint) => !hint.associatedAnswer);
  const specificHints = hints.filter((hint) => hint.associatedAnswer);

  useEffect(() => {
    setTotalHints(unlockedHints.length);
  }, [unlockedHints]);

  useEffect(()=>{ // evaluated when to disable the next and previous buttons of the Hints
    currentHint<=0 
      ? setDisabledPrevButton(true) 
      : setDisabledPrevButton(false)
    currentHint>=totalHints-1 
      ? setDisabledNextButton(true)
      : setDisabledNextButton(false)
  },[currentHint, totalHints])

  const  nextHint = ()=>{
    console.log("Siguiente Hint")
    currentHint< (totalHints-1) && setCurrentHint(currentHint+1)
  }

  const prevHint = () =>{
    console.log("Hint previo")
    currentHint>0 && setCurrentHint(currentHint-1)
    
  }

  const unlockHint = (hintId?: number) => {
    if (hintId !== undefined) {
      const hintToUnlock = genericHints.find((hint) => hint.hintId === hintId);
      if (hintToUnlock) {
        setUnlockedHints((prevUnlockedHints) => [...prevUnlockedHints, hintToUnlock]);
      }
    } else {
      //const nextGenericHint = genericHints.find((hint) => !unlockedHints.includes(hint));
      const nextGenericHint = indUnlockedHint < genericHints.length ? genericHints[indUnlockedHint] : null
      
      console.log("nextGenericHint-->", nextGenericHint)
      if (nextGenericHint) { // si hay un hint a mostrar
        setIndUnlockedHint(indUnlockedHint+1) // actualizamos el indice para el siguiente hint
        setCurrentHint(indUnlockedHint) // establecemos el hint a mostrar como el ultimo desbloqueado
        setUnlockedHints((prevUnlockedHints) => [...prevUnlockedHints, nextGenericHint]);//agregamos el hint desbloqueado
        setNumHintsActivated((prevNumHintsActivated) => prevNumHintsActivated + 1); // Incrementar el número de hints activados

      }
    }
  };

  const resetNumHintsActivated = () => {
    setNumHintsActivated(0);
  };

  return{
    //displayHints,
    unlockedHints,
    currentHint,
    totalHints,
    disabledPrevButton,
    disabledNextButton,
    numHintsActivated,
    nextHint,
    prevHint,
    unlockHint,
    resetNumHintsActivated
  }
}