# A Form Validator 

## example 
			<input id="input" type="password" data-limit='pattern:"^[a-zA-Z0-9]$"'>
			<p class="tip"></p>
			<script src="js/Validator.js"></script>
			<script src="js/input.js"></script>
			<script>
			var input = document.querySelector('#input');
			var tip = document.querySelector('.tip');
			new Input(input, tip, "blur");
			</script>