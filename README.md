# Tag with Milestone

This action tags the repository with the Milestone name. The milestone name can be bumped with an incremental number if the repository already contains a tag with the milestone.

## Inputs

| Variable  | Type | Default   | Description   |
|-------------- | ---- | -------------- | -------------- |
<!-- | `bump`    | Bool     | `true`     | Bump the milestone tag if already exists | -->
| `repo_token` | - | REQUIRED. |
| `custom_tag` | String | `${MILESTONE}` | Custom tag to set. Several placeholders can be used, see [Custom Tag Placeholders](#custom-tag-placeholders) |
| `initial_tag_number` | Number | `1` | Initial `TAG_NUMBER` placeholder. |

### Custom Tag Placeholders

| Placeholder  | Description  |
|-------------- | -------------- |
| `MILESTONE`    | Milstone name attached to the Pull Request |
| `TAG_NUMBER` | Tag number, this number gets increased if a previous tag is found. |

## Outputs

| Variable  | Type |  Description   |
|-------------- | -------------- | -------------- |
| `new_tag` | String | New tag created |
| `previous_tag` | String | Previous tag if any |
<!-- | `tag_bumped` | Bool | True if the tag has been bumped | -->

## Example usage

```yaml
- name: Bump Tag
  uses: swisstopo-test/action-milestone-bump-tag@master
  with:
    repo_token: ${{ secrets.GITHUB_TOKEN }}
    custom_tag: ${MILESTONE}_RC${TAG_NUMBER}

```
