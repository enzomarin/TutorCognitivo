import React, { useRef, useState } from "react";
import Hint from "../../../Hint";
import { MathComponent } from "../../../MathJax";
import { useAction } from "../../../../utils/action";
import { Alert, AlertIcon, Button, Center, Spacer, Input, Wrap, WrapItem } from "@chakra-ui/react";

export const TCstep2 = ({
  step2,
  setStep2Valid,
  step2Valid,
  contentID,
  topicID,
  extra,
  setExtra,
}) => {
  const response = useRef(null); //input response
  const [feedbackMsg, setFeedbackMsg] = useState(null); //feedback message
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const correctAlternatives = step2.answers[0].answer; //list of answers valid
  const action = useAction(); //send action to central system
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0); //hint counts
  const dateInitial = Date.now();
  const [lastHint, setLastHint] = useState(false);

  const compare = () => {
    setFeedbackMsg(null);
    //contador de intentos
    setAttempts(attempts + 1);
    //parametro de entrada recibido, replace elimina "espacios" y "*", trabajar todo en minuscula
    const responseStudent = response.current.value.replace(/[*]| /g, "").toLowerCase();

    if (correctAlternatives === responseStudent) {
      //valida que la entrada es correcta
      setStep2Valid((step2Valid = step2.answers[0].nextStep));
      extra.att = attempts;
      extra.hints = hints;
      extra.duration = (Date.now() - dateInitial) / 1000;
      extra.lastHint = lastHint;
      setExtra(extra);
    } else {
      if (response.current.value == "") {
        setTimeout(() => {
          setFeedbackMsg(
            <Alert status="warning">
              <AlertIcon />
              Ingrese respuesta
            </Alert>,
          );
        }, 50);
      } else {
        setError(true);
        setTimeout(() => {
          setFeedbackMsg(
            //error cuando la entrada es incorrecta
            <Alert status="error">
              <AlertIcon />
              {step2.incorrectMsg}
            </Alert>,
          );
        }, 50);
      }
    }
  };

  return (
    <>
      <Wrap padding="15px 10px 10px 10px">
        <WrapItem padding="5px 0px 10px 0px">
          <Center>
            <MathComponent tex={String.raw`${step2.expression}`} display={false} />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          <Center>
            <label>Δ = &nbsp;</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={165}
              focusBorderColor="#9DECF9"
              placeholder="Ingrese discriminante"
              ref={response}
              isReadOnly={step2Valid != null}
            />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          {step2Valid == null && (
            <>
              <Button
                colorScheme="cyan"
                variant="outline"
                onClick={() => {
                  compare();
                  response.current.value != "" &&
                    action({
                      verbName: "tryStep",
                      stepID: "" + step2.stepId,
                      contentID: contentID,
                      topicID: topicID,
                      result: step2Valid === null ? 0 : 1,
                      kcsIDs: step2.KCs,
                      extra: {
                        response: [response.current.value],
                        attempts: attempts,
                        hints: hints,
                      },
                    });
                }}
                size="sm"
              >
                Aceptar
              </Button>
              &nbsp;&nbsp;
              <Hint
                hints={step2.hints}
                contentId={contentID}
                topicId={topicID}
                stepId={step2.stepId}
                matchingError={step2.matchingError}
                response={[response]}
                error={error}
                setError={setError}
                hintCount={hints}
                setHints={setHints}
                setLastHint={setLastHint}
              ></Hint>
            </>
          )}
        </WrapItem>
      </Wrap>
      {step2Valid == null && feedbackMsg}
    </>
  );
};
