import tl = require("azure-pipelines-task-lib");
import { LogicMonitor } from "./logicmonitor";

/**
 * Pause a sensor
 * @param lm LogicMonitor class
 * @param sensorID Sensor ID
 * Pausing a sensor is done by creating a SDT
 */
async function pause(lm: LogicMonitor, sensorID: number): Promise<void> {
  const sdtType: string = tl.getInputRequired("sdtType");
  const duration: string | undefined = tl.getInput("duration");
  
  const durationInMinutes: number = duration ? parseInt(duration) : 5;
  if (isNaN(durationInMinutes)) {
    throw new Error("Invalid duration input. Please enter a valid number.");
  }

  const sdt = lm.sdtRequest(durationInMinutes, sdtType, sensorID);
  const response = await lm.postSDT(sdt);
  tl.debug(`Response: ${JSON.stringify(response)}`);

  console.log("Paused sensor. SDT ID: " + response.id);
}

/**
 * Resume a sensor
 * @param lm LogicMonitor class
 * @param sensorID Sensor ID
 * Resuming a sensor is done by deleting the SDT
 */
async function resume(lm: LogicMonitor, sensorID: number) {
  // Retrieve a list of all SDT matching a specific comment filter
  const sdtList = await lm.getSDT(sensorID)
  
  if (sdtList.total === 0) {
    throw new Error(`No SDT found to delete. Sensor ${sensorID} is not paused trough Azure Devops`);
  }
  if (sdtList.total !== 1) {
    throw new Error(`Expected 1 SDT, got ${sdtList.total}. Impossible to resume sensor without know which SDT to delete`);
  }
  if (sdtList.items[0].id === undefined) {
    throw new Error(`Invalid SDT ID received`);
  }
  
  await lm.deleteSDT(sdtList.items[0].id);
  console.log("Deleted STD");
}

/**
 * Main function
 */
async function run() {
  try {
    const credentialType: string = tl.getInputRequired("credentialType");
    const accountName: string = tl.getInputRequired("accountName");
    const action: string = tl.getInputRequired("action");
    const sensorID: string = tl.getInputRequired("sensorID");

    const sensorIDNumber = parseInt(sensorID);
    if (isNaN(sensorIDNumber)) {
      throw new Error("Invalid sensorID input. Please enter a valid number.");
    }

    let lm = new LogicMonitor(accountName);

    // Grab the relevant credentials based on the given Authentication Type
    switch (credentialType) {
      case "Bearer":
        const bearerToken: string = tl.getInputRequired("bearerToken");
        lm.useBearerToken(bearerToken);
        break;
      case "LMVv1":
        const accessId: string = tl.getInputRequired("accessId");
        const accessKey: string = tl.getInputRequired("accessKey");
        lm.useLMVv1Token(accessId, accessKey);
        break;
      default:
        throw new Error(`Invalid credential type: ${credentialType}`);
    }
    
    // If we need to pause or resume the Sensor
    switch (action) {
      case "Pause":
        await pause(lm, sensorIDNumber);
        break;
      case "Resume":
        await resume(lm, sensorIDNumber);
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }
    
  } catch (err) {
    let errorMessage = "Failed to manage the SDT";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    tl.setResult(tl.TaskResult.Failed, errorMessage);
  }
}

run();
