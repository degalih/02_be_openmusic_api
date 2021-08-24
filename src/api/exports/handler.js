class ExportsHandler {
  constructor(service, validator, playlistsService) {
    this.service = service;
    this.validator = validator;
    this.playlistsService = playlistsService;

    this.postExportPlaylistSongsHandler =
      this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    this.validator.validateExportPlaylistSongsPayload(request.payload);

    const { playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this.service.sendMessage(
      'export:playlistsongs',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });

    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
