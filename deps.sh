./lib/closure-library/bin/calcdeps.py \
	--output_mode=deps \
	--dep=./lib/closure-library/ \
	--path=./lib/easel/src \
	--path=./app/ \
> app/js/deps.js
