#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
package_dir="$(cd -- "${script_dir}/.." && pwd)"
denylist="${script_dir}/upstream-restricted-asset-sha256.txt"
provenance="${package_dir}/REFERENCE_PROVENANCE.md"

required_files=(
  "SKILL.md"
  "LICENSE"
  "THIRD_PARTY_NOTICES.md"
  "UPSTREAM-ASSET-LICENSE.md"
  "REFERENCES.md"
  "REFERENCE_PROVENANCE.md"
  "design-system/carriers.json"
  "design-system/colors.json"
  "design-system/compositions.json"
  "design-system/imperfections.json"
  "design-system/rhythm.json"
  "design-system/typography.json"
)

for relative_path in "${required_files[@]}"; do
  if [[ ! -f "${package_dir}/${relative_path}" ]]; then
    echo "Missing required package file: ${relative_path}" >&2
    exit 1
  fi
done

expected_license_sha256="2025880f6441e121c76c01bc5996e84a7498d9d5aa7222a10400d303bdd043cb"
actual_license_sha256="$(sha256sum "${package_dir}/LICENSE" | cut -d ' ' -f 1)"
if [[ "${actual_license_sha256}" != "${expected_license_sha256}" ]]; then
  echo "LICENSE does not match the pinned upstream MIT text" >&2
  exit 1
fi

expected_asset_notice_sha256="1a02a8b7a3bae6b21bb5182d6865a5d4db66777a8c5c064c64c84756eebf257f"
actual_asset_notice_sha256="$(sha256sum "${package_dir}/UPSTREAM-ASSET-LICENSE.md" | cut -d ' ' -f 1)"
if [[ "${actual_asset_notice_sha256}" != "${expected_asset_notice_sha256}" ]]; then
  echo "UPSTREAM-ASSET-LICENSE.md does not match the pinned upstream text" >&2
  exit 1
fi

if find "${package_dir}" -type l -print -quit | grep -q .; then
  echo "Package must not contain symbolic links" >&2
  exit 1
fi

if find "${package_dir}" -type d -name examples -print -quit | grep -q .; then
  echo "Package must not contain an examples directory" >&2
  exit 1
fi

if find "${package_dir}" -type f \
  \( -name 'reference-0[1-9].png' -o -name 'reference-10.png' \
  -o -name 'reference-11.jpg' -o -name 'reference-12.jpg' \) \
  -print -quit | grep -q .; then
  echo "Package contains a forbidden upstream third-party reference path" >&2
  exit 1
fi

if grep -Fq '~/Desktop/Claude skills/mono-color/' "${package_dir}/SKILL.md"; then
  echo "SKILL.md contains the forbidden upstream output path" >&2
  exit 1
fi

for catalog in "${package_dir}"/design-system/*.json; do
  python3 -m json.tool "${catalog}" >/dev/null
done

image_list="$(mktemp /tmp/mono-color-package-images.XXXXXX)"
trap 'rm -f "${image_list}"' EXIT

find "${package_dir}" -type f \
  \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) \
  -print0 >"${image_list}"

image_count=0
while IFS= read -r -d '' image_path; do
  image_count=$((image_count + 1))
  image_sha256="$(sha256sum "${image_path}" | cut -d ' ' -f 1)"
  if grep -q "^${image_sha256} " "${denylist}"; then
    echo "Package contains a byte-identical upstream restricted asset: ${image_path}" >&2
    exit 1
  fi

  image_name="$(basename -- "${image_path}")"
  if grep -Fq "  ${image_name}" "${denylist}"; then
    echo "Package reuses a restricted upstream asset filename: ${image_path}" >&2
    exit 1
  fi

  if ! grep -Fq "${image_name}" "${provenance}"; then
    echo "Missing provenance entry for image: ${image_name}" >&2
    exit 1
  fi
done <"${image_list}"

if (( image_count < 3 )); then
  echo "Package must contain at least three independently generated reference images" >&2
  exit 1
fi

echo "mono-color package verification passed (${image_count} reference images)"
