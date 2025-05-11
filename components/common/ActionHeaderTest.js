import {Box, Button, Flex, Group, CloseButton, Dialog, Portal} from "@chakra-ui/react";
import ButtonTimerGroup from "@/components/common/Timer";
import {useState} from "react";


export default function ActionHeaderTest({totalTime, handleNext, handleSubmit}) {


  const [open, setOpen] = useState(false)

  const showDialogConfirm = () => {
    setOpen(true);
  }

  const confirmSubmitTest = () => {
    handleSubmit();
    setOpen(false);
  }

  return (
    <>
      <Flex
        width="100%"
        gap={4}
        align={'center'}
        justifyContent="end">

        <Box>
          <ButtonTimerGroup
            initialTime={totalTime}
            onTimeUp={handleSubmit}
          />
        </Box>

         <Button onClick={showDialogConfirm} colorPalette="blue">Submit</Button>
      </Flex>

      {/* Dialog cảnh báo */}
      <Dialog.Root  lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        {/*<Dialog.Trigger asChild>*/}
        {/*  <Button dis variant="outline" size="sm">*/}
        {/*    Open Dialog*/}
        {/*  </Button>*/}
        {/*</Dialog.Trigger>*/}
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Submit test</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>

                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={confirmSubmitTest}>Submit</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}