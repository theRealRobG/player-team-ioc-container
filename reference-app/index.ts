import simpleTest from './container-tests/simple-container';
import singletonTest from './container-tests/singleton-test';
import typeCheckTest from './container-tests/type-check-container';

const APP_ELEMENT_ID = 'app';
const CLEAR_TEXT_ELEMENT_ID = 'clear-text';
const SIMPLE_TEST_ELEMENT_ID = 'simple-test';
const TYPE_CHECK_TEST_ELEMENT_ID = 'type-check-test';
const SINGLETON_TEST_ELEMENT_ID = 'singleton-test';

const appContainerDiv = document.getElementById(APP_ELEMENT_ID) as HTMLDivElement;
(document.getElementById(CLEAR_TEXT_ELEMENT_ID) as HTMLDivElement).onclick = clearText;
(document.getElementById(SIMPLE_TEST_ELEMENT_ID) as HTMLDivElement).onclick = runSimpleTest;
(document.getElementById(TYPE_CHECK_TEST_ELEMENT_ID) as HTMLDivElement).onclick = runTypeCheckTest;
(document.getElementById(SINGLETON_TEST_ELEMENT_ID) as HTMLDivElement).onclick = runSingletonTest;

function clearText() {
    appContainerDiv.innerHTML = '';
}

function runTest(executeTest: (appDiv: HTMLDivElement) => void) {
    clearText();
    executeTest(appContainerDiv);
}

function runSimpleTest() {
    runTest(simpleTest);
}

function runTypeCheckTest() {
    runTest(typeCheckTest);
}

function runSingletonTest() {
    runTest(singletonTest);
}
