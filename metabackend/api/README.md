# Using `finetune.py`

`finetune.py` takes a json file of user profiles and messages and converts it 
into a JSONL format ready for GPT-3's fine-tuning process.

For more data on fine-tuning, see 
https://beta.openai.com/docs/guides/fine-tuning. Instructions on how to
fine-tune will be added here soon.

`finetune.py` can be used as follows:

```
usage: finetune.py [-h] --input_file INPUT_FILE [--output_file OUTPUT_FILE] [-n N] [--max_tokens MAX_TOKENS] [--quiet] --select {first,random,r_uniq,greed}

Prepare data for fine-tuning a GPT-3 model.

optional arguments:
  -h, --help            show this help message and exit
  --input_file INPUT_FILE, -i INPUT_FILE
                        .json file to read from.
  --output_file OUTPUT_FILE, -o OUTPUT_FILE
                        .jsonl file to write to. If not provided, defaults to `train.jsonl` in same dir as input_file.
  -n N                  Maximum number of messages to present to GPT-3 as examples. Integer value, 0 < n < 20.
  --max_tokens MAX_TOKENS, -t MAX_TOKENS
                        Maximum number of tokens allowed in a single message.
  --quiet, -q           Don't log info or show progress bars.
  --select {first,random,r_uniq,greed}, -s {first,random,r_uniq,greed}
                        Selection method | first, First N messages. | random, N random messages. | r_uniq, N random unique messages. | greed, Greedily maximizes unique tokens.
```

The "selection method" dictates which messages should be taken from each 
profile as examples of style. For now, only basic selection methods are 
available:

* `first` selects the first N messages recorded.
* `random` selects N random messages.
* `r_uniq` removes any redundant messages and selects N from those.
* `greed` takes the message with the most unique tokens, removes those tokens from the other messages, then repeats.
