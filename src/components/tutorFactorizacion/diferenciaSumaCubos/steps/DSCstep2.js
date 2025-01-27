import React, { useRef, useState } from "react";
import Hint from "../../../Hint";
import { MathComponent } from "../../../MathJax";
import { useAction } from "../../../../utils/action";
import { Alert, AlertIcon, Button, Center, Spacer, Input, WrapItem, Wrap } from "@chakra-ui/react";

export const DSCstep2 = ({
  step2,
  setStep2Valid,
  step2Valid,
  contentID,
  topicID,
  extra,
  setExtra,
}) => {
  const response1 = useRef(null); //first input response
  const response2 = useRef(null); //second input response
  const correctAlternatives = step2.answers.map(elemento => elemento.answer); //list of answers valid
  const [feedbackMsg, setFeedbackMsg] = useState(null); //feedback message
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const action = useAction(); //send action to central system
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0); //hint counts
  const dateInitial = Date.now();
  const [lastHint, setLastHint] = useState(false);

  const compare = () => {
    setFeedbackMsg(null);
    //contador de intentos
    setAttempts(attempts + 1);
    const responseStudent = [
      response1.current.value.replace(/[*]| /g, "").toLowerCase(),
      response2.current.value.replace(/[*]| /g, "").toLowerCase(),
    ];
    const validate = element =>
      element[0] === responseStudent[0] && element[1] === responseStudent[1];

    if (correctAlternatives.some(validate)) {
      setStep2Valid((step2Valid = "Terminado"));
      extra.att = attempts;
      extra.hints = hints;
      extra.duration = (Date.now() - dateInitial) / 1000;
      extra.lastHint = lastHint;
      setExtra(extra);

      setFeedbackMsg(
        <Alert status="success">
          <AlertIcon />
          {step2.correctMsg}
        </Alert>,
      );
    } else {
      if (response1.current.value == "" || response2.current.value == "") {
        setTimeout(() => {
          setFeedbackMsg(
            <Alert status="warning">
              <AlertIcon />
              Ingrese respuesta(s)
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
            <label>( </label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={125}
              focusBorderColor="#9DECF9"
              placeholder="Ingrese factor 1"
              ref={response1}
              isReadOnly={step2Valid != null}
            />
            <label htmlFor="label2">)(</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={125}
              focusBorderColor="#9DECF9"
              placeholder="Ingrese factor 2"
              ref={response2}
              isReadOnly={step2Valid != null}
            />
            <label htmlFor="label3">)</label>
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
                  response1.current.value != "" &&
                    response2.current.value != "" &&
                    action({
                      verbName: "tryStep",
                      stepID: "" + step2.stepId,
                      contentID: contentID,
                      topicID: topicID,
                      result: step2Valid === null ? 0 : 1,
                      kcsIDs: step2.KCs,
                      extra: {
                        response: [response1.current.value, response2.current.value],
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
                response={[response1, response2]}
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
      {feedbackMsg}
    </>
  );
};
