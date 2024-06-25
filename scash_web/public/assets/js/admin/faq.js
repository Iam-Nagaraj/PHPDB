$(document).ready(async function () {
	let country_code_symbol = '+';
	let active_status = 1;
	let inactive_status = 2;
	let columns = [

		{ title: 'Title', data: 'title' },
		{
			title: 'Action',
			data: 'action',
			orderable: false,

		}


	];
	await InitDataTable('faq-table', faq_datatable_url, columns);

	const statusButton = document.querySelector('.status-action');
	if (statusButton) {
		statusButton.addEventListener('change', (element) => {
			faqStatus($(element.target).attr('data-id'), $(element.target).attr('data-status'));
		});
	}

	const faqStatus = async (id, status) => {
		if (confirm('Are You sure?')) {
			const fromData = { id: id, status: (status == active_status ? inactive_status : active_status) };
			let url = faq_status_change_url;
			const options = {
				type: "POST",
				url: url,
				data: fromData,
				headers: { Accept: "application/json" },
				beforeSend: function () {
					$(".loader_box").show();
				},
				complete: function () {
					$(".loader_box").hide();
				}
			};

			try {
				const response = await ajaxRequest(options);
				if (response.success == true) {
					$.NotificationApp.send("Success", response.message, "top-right", "#4fa98c", "success");
					await new Promise(resolve => setTimeout(resolve, 2500));
					location.reload();
				}

			} catch (error) {
				console.log(error);
			}
		}
	}




	$(document).on('click', '.faq-list-tab', async function () {
		let $this = $(this);
		let status = $this.attr('data-type');

		await InitDataTable('faq-table', faq_datatable_url, columns, status);
	})

})

$(document).on('submit', '#faq-form', function (e) {
	e.preventDefault();
	let myForm = document.getElementById('faq-form');
	let target = "faq-body";
	let formData = new FormData(myForm);
	let url = myForm?.getAttribute('action');

	AjaxFromLoginSubmit(formData, url, 'POST', target)

	// AjaxFromSubmit(formData, url,'POST',true);


});

async function AjaxFromLoginSubmit(formData, url, method, target) {
	$(".loader_box").show();
	$.ajaxSetup({
        headers : {
            'CSRFToken' : $('meta[name="_token"]').attr('content')
        }
    });
	$.ajax({
		type: method,
		url: url,
		data: formData,
		contentType: false,
		processData: false,
		success: async function (response) {
			$('.is-invalid').removeClass('is-invalid');
			$('.invalid-feedback strong').html('');
			$('#' + target).html(response?.html);
			$.NotificationApp.send("Success", response?.msg, "top-right", "#4cffc5", "success");
			await new Promise(resolve => setTimeout(resolve, 2500));
			navigateTo('/cms/faq');

		}, error: async function (response) {
			if (response.status === 422) {
				$('.is-invalid').hide();
				let errors = response.responseJSON.errors;
				Object.keys(errors).forEach(function (key) {
					console.log(key);
					$("#" + key).text(errors[key][0]);
					$("#" + key).show();
				});

			}
			let errors = response.responseJSON
			if (errors?.errors?.error) {
				$(".show_all_error.invalid-feedback").show();
				$(".show_all_error.invalid-feedback").text(errors?.message);
			}
			$(".loader_box").hide();
			return response;
		}
	})
}

