import { getGitHash, runAndExit, removeTrailingDot, gcloud } from '../src/util';

describe(__filename, () => {
  it('getGitHash returns a ten-character hash', async () => {
    const gitHash = await getGitHash();
    const hexCharsRegex = /[a-f0-9][10]/;
    expect(gitHash).toMatch(hexCharsRegex);
  });

  it('stripRootLabel removes the trailing implicit root domain label from a dns name', async () => {
    expect(removeTrailingDot('.foo.')).toEqual('.foo');
  });

  it('gcloudFactory returns a function that runs the gcloud cli', async () => {
    const result = await gcloud({
      projectId: 'foo',
      cwd: '.',
      args: ['version'],
    });
    expect(result['Google Cloud SDK']).toMatch(/.*\..*\..*/);
  });

  it('runAndExit runs the provided async function and calls process.exit(0)', async () => {
    const mockAsyncFunc = jest.fn();
    const originalProcessExit = process.exit;
    const mockProcessExit = jest.fn();
    (process as any).exit = mockProcessExit;
    await runAndExit(mockAsyncFunc);
    process.exit = originalProcessExit;
    expect(mockAsyncFunc.mock.calls).toEqual([[]]);
    expect(mockProcessExit.mock.calls).toEqual([[0]]);
  });
});